<script>
import { getUserProfileById } from '../services/user-profiles'
import { supabase } from '../services/supabase'
import { subscribeToAuthStateChanges } from '../services/auth'
import { followUser, unfollowUser, isFollowing, getFollowStats } from '../services/follows'

export default {
    name: 'UserProfile',
    data() {
        return {
            user: {},
            movies: [],
            loading: false,
            currentUser: { id: null },
            isFollowingUser: false,
            followersCount: 0,
            followingCount: 0,
            followLoading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true
            const userId = this.$route.params.id

            this.user = await getUserProfileById(userId)
            await this.fetchMovies(userId)
            await this.fetchFollowStats(userId)

        } catch (error) {
        } finally {
            this.loading = false
        }

        // Suscribirse a cambios de autenticación DESPUÉS de cargar el usuario
        subscribeToAuthStateChanges(async (newUserState) => {
            this.currentUser = newUserState
            if (newUserState.id && this.user.id) {
                await this.checkFollowStatus()
            }
        })
    },
    methods: {
        async fetchMovies(userId) {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('user_id', userId)
            if (error) {
            }
            this.movies = data || []

            // Cargar likes y comentarios para cada película
            if (this.movies.length > 0) {
                await this.fetchMovieStats()
            }
        },

        async fetchMovieStats() {
            // Crear todas las promesas para likes y comentarios en paralelo
            const statsPromises = this.movies.map(async (movie) => {
                const [likesResult, commentsResult] = await Promise.all([
                    supabase
                        .from('likes')
                        .select('*', { count: 'exact', head: true })
                        .eq('movie_id', movie.id),
                    supabase
                        .from('comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('movie_id', movie.id)
                ])

                // Agregar las estadísticas al objeto de la película
                movie.likesCount = likesResult.count || 0
                movie.commentsCount = commentsResult.count || 0
            })

            // Ejecutar todas las promesas en paralelo
            await Promise.all(statsPromises)
        },

        async fetchFollowStats(userId) {
            try {
                const stats = await getFollowStats(userId)
                this.followersCount = stats.followersCount
                this.followingCount = stats.followingCount
            } catch (error) {
            }
        },

        async checkFollowStatus() {
            if (!this.currentUser.id || !this.user.id) return
            try {
                this.isFollowingUser = await isFollowing(this.user.id)
            } catch (error) {
            }
        },

        async toggleFollow() {
            if (!this.currentUser.id) {
                alert('Tenés que iniciar sesión para seguir usuarios')
                return
            }

            if (this.currentUser.id === this.user.id) {
                alert('No podés seguirte a vos mismo')
                return
            }

            this.followLoading = true
            try {
                if (this.isFollowingUser) {
                    await unfollowUser(this.user.id)
                    this.isFollowingUser = false
                    this.followersCount--
                } else {
                    await followUser(this.user.id)
                    this.isFollowingUser = true
                    this.followersCount++
                }
            } catch (error) {
                alert('Error al actualizar el seguimiento')
            } finally {
                this.followLoading = false
            }
        },
    },
}
</script>

<template>
    <section class="pt-20 bg-[#121212] text-white min-h-screen">
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#EFB810] border-t-transparent"></div>
        </div>

        <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- CABECERA PERFIL -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 py-8 border-b border-gray-800">
                <div class="relative">
                    <div class="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                        <img :src="user.avatar_url || '/default-avatar.png'" alt="Avatar"
                            class="w-full h-full rounded-full object-cover bg-[#121212]" />
                    </div>
                </div>

                <div class="flex-1 text-center sm:text-left space-y-4">
                    <!-- Username y acciones -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                        <h1 class="text-xl sm:text-2xl font-light">{{ user.username }}</h1>
                        <div v-if="currentUser.id && currentUser.id !== user.id" class="flex gap-2">
                            <button @click="toggleFollow"
                                :disabled="followLoading"
                                :class="isFollowingUser ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#EFB810] text-black hover:bg-yellow-400'"
                                class="px-4 py-1.5 text-sm font-medium rounded transition disabled:opacity-50">
                                {{ followLoading ? 'Cargando...' : (isFollowingUser ? 'Siguiendo' : 'Seguir') }}
                            </button>
                            <span v-if="user.verified"
                                class="inline-flex items-center px-2 py-1 bg-blue-600 text-xs font-medium rounded-full text-white">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                Verificado
                            </span>
                        </div>
                    </div>

                    <!-- Estadísticas -->
                    <div class="flex justify-center sm:justify-start gap-8 text-base">
                        <div class="text-center sm:text-left">
                            <span class="font-semibold">{{ movies.length }}</span>
                            <span class="text-gray-400 ml-1">publicaciones</span>
                        </div>
                        <div class="text-center sm:text-left cursor-pointer hover:text-gray-300 transition">
                            <span class="font-semibold">{{ followersCount }}</span>
                            <span class="text-gray-400 ml-1">seguidores</span>
                        </div>
                        <div class="text-center sm:text-left cursor-pointer hover:text-gray-300 transition">
                            <span class="font-semibold">{{ followingCount }}</span>
                            <span class="text-gray-400 ml-1">seguidos</span>
                        </div>
                    </div>

                    <!-- Bio -->
                    <div class="space-y-2">
                        <p class="text-sm font-medium">{{ user.username }}</p>
                        <p class="text-sm text-gray-300">{{ user.bio || 'Sin descripción...' }}</p>
                        <div class="flex items-center gap-1 text-sm text-gray-400" v-if="user.location">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                            <span>{{ user.location }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 text-xs" v-if="user.favorite_genres || user.favorite_directors">
                            <span v-if="user.favorite_genres" class="bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                                </svg>
                                {{ user.favorite_genres }}
                            </span>
                            <span v-if="user.favorite_directors" class="bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                                </svg>
                                {{ user.favorite_directors }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PESTAÑAS -->
            <div class="flex justify-center border-b border-gray-800">
                <div class="flex items-center gap-8">
                    <button class="flex items-center gap-2 py-3 text-sm font-medium text-white border-t border-white">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                        </svg>
                        PUBLICACIONES
                    </button>
                </div>
            </div>

            <!-- GRID DE PUBLICACIONES -->
            <div class="py-8">
                <div v-if="movies.length" class="grid grid-cols-3 gap-1 sm:gap-4">
                    <div v-for="movie in movies" :key="movie.id"
                        class="aspect-square bg-[#1C1C1C] border border-gray-800 overflow-hidden hover:opacity-75 transition-opacity group relative">
                        <RouterLink :to="'/movies/' + movie.id" class="block w-full h-full">
                            <img :src="movie.poster" :alt="movie.titulo" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div class="flex items-center gap-4 text-white text-sm font-semibold">
                                    <div class="flex items-center gap-1">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>{{ movie.likesCount || 0 }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>{{ movie.commentsCount || 0 }}</span>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>

                <div v-else class="text-center py-16 space-y-4">
                    <div class="w-16 h-16 mx-auto border-2 border-gray-600 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-light">Sin publicaciones aún</h3>
                    <p class="text-gray-400 text-sm">Cuando {{ user.username }} comparta películas, aparecerán aquí.</p>
                </div>
            </div>
        </div>
    </section>
</template>
