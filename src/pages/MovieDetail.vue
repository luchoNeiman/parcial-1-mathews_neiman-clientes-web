<script>
import { supabase } from '../services/supabase.js'
import { useRoute } from 'vue-router'
import { subscribeToAuthStateChanges } from '../services/auth.js'
import CommentForm from '../components/CommentForm.vue'
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
        }
    },
    async created() {
        // 🟡 Obtener ID de la ruta
        const route = useRoute()
        const movieId = route.params.id

        // 🟢 Cargar datos de la película
        const { data, error } = await supabase
            .from('movies')
            .select('*, user_profiles(username, avatar_url)')
            .eq('id', movieId)
            .single()

        if (error) console.error('Error al cargar película:', error.message)
        this.movie = data

        // 🔵 Escuchar cambios de sesión
        unsubscribeFromAuth = subscribeToAuthStateChanges(
            (newUserState) => (this.user = newUserState)
        )
    },
    unmounted() {
        unsubscribeFromAuth()
    },
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
            <div class="flex flex-col lg:flex-row gap-8 bg-[#1C1C1C] border border-gray-800 rounded-lg overflow-hidden">
                <!-- Imagen principal -->
                <div class="lg:w-2/3">
                    <img :src="movie.poster" :alt="movie.titulo"
                        class="w-full h-64 sm:h-96 lg:h-full object-cover" />
                </div>

                <!-- Panel lateral con info -->
                <div class="lg:w-1/3 flex flex-col">
                    <!-- Header con usuario -->
                    <div class="flex items-center gap-3 p-4 border-b border-gray-800">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                            <img :src="movie.user_profiles?.avatar_url || '/default-avatar.png'"
                                class="w-full h-full rounded-full object-cover bg-[#121212]" />
                        </div>
                        <div class="flex-1">
                            <RouterLink :to="'/usuarios/' + movie.user_id"
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
                        <button class="text-gray-400 hover:text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Contenido scrolleable -->
                    <div class="flex-1 flex flex-col max-h-96 lg:max-h-full">
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
                    </div>
                </div>
            </div>

            <!-- Películas relacionadas o del mismo usuario -->
            <div class="mt-12">
                <h3 class="text-lg font-semibold mb-4 text-gray-300">
                    Más de {{ movie.user_profiles?.username || 'este usuario' }}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <!-- Placeholder para películas relacionadas -->
                    <div v-for="i in 6" :key="i"
                        class="aspect-square bg-gray-800 rounded border border-gray-700 animate-pulse">
                    </div>
                </div>

                <!-- Mostrar solo si el usuario logueado es el dueño -->
                <RouterLink v-if="user?.id && movie.user_id === user.id" :to="`/movies/editar/${movie.id}`"
                    class="px-4 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition mt-4 inline-block">
                    ✏️ Editar publicación
                </RouterLink>
            </div>
        </div>

        <!-- Loading state -->
        <div v-else class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#EFB810] border-t-transparent"></div>
        </div>
        <div v-else class="text-center py-10 text-gray-500">
            Cargando datos de la película...
        </div>
    </section>
</template>
