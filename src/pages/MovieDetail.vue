<script>
import { supabase } from '../services/supabase.js'
import { useRoute } from 'vue-router'
import { subscribeToAuthStateChanges } from '../services/auth.js'
import LikeButton from '../components/LikeButton.vue'

let unsubscribeFromAuth = () => { }

export default {
    name: 'MovieDetail',
    components: { LikeButton },
    data() {
        return {
            movie: null,
            user: {
                id: null,
                email: null,
                username: null,
            },
            relatedMovies: [],
            loadingRelated: false,
            comments: [],
            newComment: '',
            loadingComments: false,
        }
    },
    async created() {
        // Obtener ID de la ruta
        const route = useRoute()
        const movieId = route.params.id

        // Cargar la película inicial
        await this.loadMovie(movieId)

        // Escuchar cambios de sesión
        unsubscribeFromAuth = subscribeToAuthStateChanges(
            (newUserState) => (this.user = newUserState)
        )
    },
    unmounted() {
        unsubscribeFromAuth()
    },
    watch: {
        '$route'(to, from) {
            // Cuando cambia la ruta, recargar la película
            if (to.params.id !== from.params.id) {
                this.loadMovie(to.params.id)
            }
        }
    },
    methods: {
        async loadMovie(movieId) {
            try {
                const { data, error } = await supabase
                    .from('movies')
                    .select('*, user_profiles(username, avatar_url)')
                    .eq('id', movieId)
                    .single()

                if (error) {
                    console.error('Error al cargar película:', error.message)
                    return
                }

                this.movie = data

                // Cargar películas relacionadas del mismo usuario
                if (data?.user_id) {
                    await this.fetchRelatedMovies(data.user_id, movieId)
                }

                // Cargar comentarios de la película
                await this.fetchComments(movieId)
            } catch (error) {
                console.error('Error:', error.message)
            }
        },
        async fetchRelatedMovies(userId, currentMovieId) {
            this.loadingRelated = true
            try {
                const { data, error } = await supabase
                    .from('movies')
                    .select('id, titulo, poster')
                    .eq('user_id', userId)
                    .neq('id', currentMovieId) // Excluir la película actual
                    .limit(6)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error al cargar películas relacionadas:', error.message)
                } else {
                    this.relatedMovies = data || []
                }
            } catch (error) {
                console.error('Error:', error.message)
            } finally {
                this.loadingRelated = false
            }
        },

        async fetchComments(movieId) {
            this.loadingComments = true
            try {
                const { data, error } = await supabase
                    .from('comments')
                    .select('*, user_profiles(username, avatar_url)')
                    .eq('movie_id', movieId)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error al cargar comentarios:', error.message)
                } else {
                    this.comments = data || []
                }
            } catch (error) {
                console.error('Error:', error.message)
            } finally {
                this.loadingComments = false
            }
        },

        async postComment() {
            if (!this.newComment.trim()) return
            if (!this.user.id) {
                alert('Iniciá sesión para comentar.')
                return
            }

            try {
                const { error } = await supabase.from('comments').insert({
                    movie_id: this.movie.id,
                    user_id: this.user.id,
                    content: this.newComment.trim(),
                })

                if (!error) {
                    this.newComment = ''
                    await this.fetchComments(this.movie.id)
                }
            } catch (error) {
                console.error('Error al publicar comentario:', error.message)
            }
        }
    }
}
</script>

<template>
    <section class="pt-20 bg-[#121212] text-white min-h-screen">
        <div v-if="movie" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Botón volver -->
            <div class="mb-6">
                <button @click="$router.go(-1)"
                    class="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Volver
                </button>
            </div>

            <!-- Layout tipo Instagram para pantallas grandes, stack para móviles -->
            <div class="flex flex-col xl:flex-row gap-8 bg-[#1C1C1C] border border-gray-800 rounded-lg overflow-hidden">
                <!-- Imagen principal -->
                <div class="xl:w-3/5">
                    <img :src="movie.poster" :alt="movie.titulo"
                        class="w-full h-64 sm:h-96 xl:h-full object-cover" />
                </div>

                <!-- Panel lateral con info -->
                <div class="xl:w-2/5 flex flex-col min-w-0">
                    <!-- Header con usuario -->
                    <div class="flex items-center gap-3 p-4 border-b border-gray-800">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                            <img :src="movie.user_profiles?.avatar_url || '/default-avatar.png'"
                                class="w-full h-full rounded-full object-cover bg-[#121212]" />
                        </div>
                        <div class="flex-1">
                            <RouterLink :to="'/usuario/' + movie.user_id"
                                class="font-semibold text-white hover:text-gray-300 transition">
                                {{ movie.user_profiles?.username || 'Anónimo' }}
                            </RouterLink>
                            <p class="text-xs text-gray-400">
                                {{ new Date(movie.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) }}
                            </p>
                        </div>
                    </div>

                    <!-- Contenido scrolleable -->
                    <div class="flex-1 flex flex-col max-h-96 xl:max-h-full">
                        <!-- Título y descripción -->
                        <div class="p-4 space-y-3">
                            <h1 class="text-xl font-bold text-[#EFB810]">{{ movie.titulo }}</h1>
                            <p class="text-sm text-gray-300 leading-relaxed">
                                <span class="font-semibold text-white mr-2">{{ movie.user_profiles?.username || 'Anónimo' }}</span>
                                {{ movie.description }}
                            </p>

                            <!-- Tags de género si están disponibles -->
                            <div class="flex flex-wrap gap-2" v-if="movie.genre">
                                <span class="px-2 py-1 bg-gray-800 text-xs rounded-full text-gray-300">
                                    {{ movie.genre }}
                                </span>
                            </div>
                        </div>


                        <!-- Acciones fijas -->
                        <div class="p-4 border-t border-gray-800 bg-[#1C1C1C]">
                            <!-- Botones de interacción -->
                <LikeButton :movieId="movie.id" />

                            <!-- Información adicional -->
                            <div class="mt-3 text-xs text-gray-500">
                                <p>Publicado el {{ new Date(movie.created_at).toLocaleDateString('es-ES') }}</p>
                            </div>
                        </div>

                        <!-- Sección de comentarios -->
                        <div class="border-t border-gray-800 bg-[#1C1C1C] flex-1 max-h-60 xl:max-h-80 overflow-y-auto">
                            <!-- Loading state -->
                            <div v-if="loadingComments" class="p-4 text-center">
                                <div class="animate-spin rounded-full h-6 w-6 border-2 border-[#EFB810] border-t-transparent mx-auto"></div>
                            </div>

                            <!-- Comentarios existentes -->
                            <div v-else-if="comments.length" class="p-4 space-y-3">
                                <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 flex-shrink-0">
                                        <img :src="comment.user_profiles?.avatar_url || '/default-avatar.png'"
                                            class="w-full h-full rounded-full object-cover bg-[#121212]" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm">
                                            <RouterLink :to="'/usuario/' + comment.user_id"
                                                class="font-semibold text-[#EFB810] hover:text-yellow-400 transition mr-2">
                                                {{ comment.user_profiles?.username || 'Anónimo' }}
                                            </RouterLink>
                                            <span class="text-gray-300">{{ comment.content }}</span>
                                        </p>
                                        <p class="text-xs text-gray-500 mt-1">
                                            {{ new Date(comment.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Estado vacío -->
                            <div v-else class="p-8 text-center">
                                <div class="w-12 h-12 mx-auto mb-3 text-gray-600">
                                    <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <p class="text-gray-400 text-sm font-medium">Sin comentarios aún</p>
                                <p class="text-gray-500 text-xs mt-1">Sé el primero en comentar esta película</p>
                            </div>
                        </div>

                        <!-- Formulario para agregar comentario -->
                        <div class="p-3 xl:p-4 border-t border-gray-800 bg-[#1C1C1C] flex-shrink-0">
                            <div class="flex gap-2 xl:gap-3 items-start">
                                <div class="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 flex-shrink-0 mt-0.5">
                                    <img :src="user.avatar_url || '/default-avatar.png'"
                                        class="w-full h-full rounded-full object-cover bg-[#121212]" />
                                </div>
                                <div class="flex-1 min-w-0 flex flex-col sm:flex-row gap-2">
                                    <input v-model="newComment" type="text" placeholder="Agregá un comentario..."
                                        class="flex-1 bg-transparent border-none text-sm text-gray-300 focus:outline-none placeholder-gray-500 min-w-0"
                                        @keyup.enter="postComment" />
                                    <button @click="postComment"
                                        :disabled="!newComment.trim()"
                                        :class="newComment.trim() ? 'text-[#EFB810] hover:text-yellow-400' : 'text-gray-600 cursor-not-allowed'"
                                        class="text-sm font-semibold transition flex-shrink-0 py-1 px-2 xl:px-0">
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Películas relacionadas o del mismo usuario -->
            <div class="mt-12">
                <h3 class="text-lg font-semibold mb-4 text-gray-300">
                    Más de {{ movie.user_profiles?.username || 'este usuario' }}
                </h3>

                <!-- Loading state -->
                <div v-if="loadingRelated" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div v-for="i in 6" :key="i"
                        class="aspect-square bg-gray-800 rounded border border-gray-700 animate-pulse">
                    </div>
                </div>

                <!-- Películas reales -->
                <div v-else-if="relatedMovies.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div v-for="relatedMovie in relatedMovies" :key="relatedMovie.id"
                        class="aspect-square bg-gray-800 rounded border border-gray-700 overflow-hidden hover:opacity-75 transition-opacity group relative">
                        <RouterLink :to="'/movies/' + relatedMovie.id" class="block w-full h-full">
                            <img :src="relatedMovie.poster" :alt="relatedMovie.titulo"
                                class="w-full h-full object-cover" />
                            <!-- Overlay con título -->
                            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p class="text-white text-sm font-medium text-center px-2">{{ relatedMovie.titulo }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </div>

                <!-- Estado vacío -->
                <div v-else class="text-center py-8">
                    <div class="w-16 h-16 mx-auto mb-4 text-gray-600">
                        <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                        </svg>
                    </div>
                    <p class="text-gray-400 text-sm">No hay nada que ver por acá</p>
                    <p class="text-gray-500 text-xs mt-1">{{ movie.user_profiles?.username || 'Este usuario' }} no tiene más películas</p>
                </div>

                <!-- Mostrar solo si el usuario logueado es el dueño -->
                <RouterLink v-if="user?.id && movie.user_id === user.id" :to="`/movies/editar/${movie.id}`"
                    class="px-4 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition mt-6 inline-flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                    Editar publicación
                </RouterLink>
            </div>
        </div>

        <!-- Loading state -->
        <div v-else class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#EFB810] border-t-transparent"></div>
        </div>
    </section>
</template>
