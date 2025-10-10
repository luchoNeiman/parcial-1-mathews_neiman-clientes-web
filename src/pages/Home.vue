<script>
import { supabase } from '../services/supabase'
import { subscribeToAuthStateChanges } from '../services/auth'
import MovieCard from '../components/MovieCard.vue'

export default {
    name: 'Home',
    components: {
        MovieCard
    },
    data() {
        return {
            user: {
                id: null,
                email: null,
                username: null,
                avatar_url: null,
            },
            recentMovies: [],
            suggestedUsers: [],
            loading: false,
        }
    },
    methods: {
        async fetchRecentMovies() {
            this.loading = true
            try {
                const { data, error } = await supabase
                    .from('movies')
                    .select('*, user_profiles(username, avatar_url)')
                    .order('created_at', { ascending: false })
                    .limit(6)

                if (!error) {
                    this.recentMovies = data || []
                }
            } catch (error) {
                // Error handling for loading recent movies
            } finally {
                this.loading = false
            }
        },

        async fetchSuggestedUsers() {
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('id, username, avatar_url')
                    .neq('id', this.user.id || '')
                    .limit(5)

                if (!error) {
                    this.suggestedUsers = data || []
                }
            } catch (error) {
                // Error handling for loading suggested users
            }
        }
    },
    async mounted() {
        subscribeToAuthStateChanges(async (newUserState) => {
            this.user = newUserState
            await this.fetchRecentMovies()
            if (newUserState.id) {
                await this.fetchSuggestedUsers()
            }
        })
    }
}
</script>

<template>
    <div class="min-h-screen bg-[#121212] text-white">
        <!-- Hero Section con Video (mantener arriba como querías) -->
        <section class="relative h-[500px] md:h-[600px] flex items-center justify-center text-center overflow-hidden">
            <!-- VIDEO DE FONDO -->
            <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover brightness-[0.4]">
                <source src="/cinema-background.mp4" type="video/mp4" />
            </video>

            <!-- OVERLAY -->
            <div class="absolute inset-0 bg-black/60"></div>

            <!-- CONTENIDO -->
            <div class="relative z-10 px-4">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#EFB810] drop-shadow-md">
                    Underground Cinema
                </h1>
                <p class="max-w-xl mx-auto text-base text-gray-200 leading-relaxed mb-6">
                    Descubre películas de culto, comparte tus favoritas y conecta con otros cinéfilos
                </p>
                <RouterLink to="/movies"
                    class="inline-block px-6 py-2 bg-[#EFB810] text-black font-semibold rounded-lg hover:bg-yellow-400 transition">
                    Explorar películas
                </RouterLink>
            </div>
        </section>

        <!-- Layout estilo Instagram -->
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="flex flex-col lg:flex-row gap-8">

                <!-- COLUMNA PRINCIPAL - FEED -->
                <div class="lg:w-2/3">
                    <!-- Stories Section -->
                    <div v-if="user.id" class="mb-8">
                        <div class="flex items-center gap-4 p-4 bg-[#1C1C1C] border border-gray-800 rounded-lg">
                            <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                                <div class="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                                    <svg class="w-6 h-6 text-[#EFB810]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 18v-6h4v6H8z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold text-white">Bienvenido, {{ user.username || 'Cinéfilo' }}!</h3>
                                <p class="text-sm text-gray-400">Descubre las últimas películas de la comunidad</p>
                            </div>
                            <RouterLink to="/movies/crear"
                                class="px-4 py-2 bg-[#EFB810] text-black font-medium rounded-lg hover:bg-yellow-400 transition text-sm">
                                Publicar
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Feed de Posts -->
                    <div class="space-y-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-semibold text-white">Publicaciones recientes</h2>
                            <RouterLink to="/movies"
                                class="text-[#EFB810] hover:text-yellow-400 transition text-sm font-medium">
                                Ver todas
                            </RouterLink>
                        </div>

                        <!-- Loading state -->
                        <div v-if="loading" class="space-y-6">
                            <div v-for="i in 3" :key="i" class="bg-[#1C1C1C] border border-gray-800 rounded-xl p-4">
                                <div class="animate-pulse">
                                    <div class="flex items-center gap-3 mb-4">
                                        <div class="w-10 h-10 bg-gray-700 rounded-full"></div>
                                        <div class="flex-1 space-y-2">
                                            <div class="h-4 bg-gray-700 rounded w-24"></div>
                                            <div class="h-3 bg-gray-700 rounded w-16"></div>
                                        </div>
                                    </div>
                                    <div class="h-64 bg-gray-700 rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Posts reales -->
                        <div v-else-if="recentMovies.length">
                            <MovieCard
                                v-for="movie in recentMovies"
                                :key="movie.id"
                                :movie="movie"
                            />
                        </div>

                        <!-- Estado vacío -->
                        <div v-else class="text-center py-16">
                            <div class="w-16 h-16 mx-auto mb-4 text-gray-600">
                                <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-medium text-gray-300 mb-2">No hay publicaciones aún</h3>
                            <p class="text-gray-500 text-sm mb-4">Sé el primero en compartir una película</p>
                            <RouterLink to="/movies/crear"
                                class="inline-block px-6 py-2 bg-[#EFB810] text-black font-semibold rounded-lg hover:bg-yellow-400 transition">
                                Crear primera publicación
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- SIDEBAR DERECHO - SUGERENCIAS -->
                <div class="lg:w-1/3">
                    <div class="sticky top-24 space-y-6">

                        <!-- Perfil del usuario logueado -->
                        <div v-if="user.id" class="bg-[#1C1C1C] border border-gray-800 rounded-lg p-4">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                                    <img :src="user.avatar_url || '/default-avatar.png'"
                                        class="w-full h-full rounded-full object-cover bg-[#121212]" />
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-white">{{ user.username || 'Usuario' }}</h3>
                                    <p class="text-sm text-gray-400">{{ user.email }}</p>
                                </div>
                                <RouterLink to="/mi-perfil"
                                    class="text-[#EFB810] hover:text-yellow-400 transition text-sm font-medium">
                                    Ver perfil
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Perfiles que podrían interesarte -->
                        <div v-if="user.id && suggestedUsers.length" class="bg-[#1C1C1C] border border-gray-800 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-semibold text-white">Perfiles que podrían interesarte</h3>
                                <RouterLink to="/movies" class="text-[#EFB810] hover:text-yellow-400 transition text-sm">
                                    Ver más
                                </RouterLink>
                            </div>
                            <div class="space-y-3">
                                <div v-for="suggestedUser in suggestedUsers" :key="suggestedUser.id"
                                    class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                                        <img :src="suggestedUser.avatar_url || '/default-avatar.png'"
                                            class="w-full h-full rounded-full object-cover bg-[#121212]" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <RouterLink :to="`/usuario/${suggestedUser.id}`"
                                            class="font-medium text-white hover:text-gray-300 transition text-sm block truncate">
                                            {{ suggestedUser.username }}
                                        </RouterLink>
                                        <p class="text-xs text-gray-500">Cinéfilo de la comunidad</p>
                                    </div>
                                    <RouterLink :to="`/usuario/${suggestedUser.id}`"
                                        class="text-[#EFB810] hover:text-yellow-400 transition text-sm font-medium">
                                        Ver perfil
                                    </RouterLink>
                                </div>
                            </div>
                        </div>

                        <!-- Call to action para usuarios no logueados -->
                        <div v-if="!user.id" class="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6 text-center">
                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                                <div class="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                                    <svg class="w-8 h-8 text-[#EFB810]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                                    </svg>
                                </div>
                            </div>
                            <h3 class="font-semibold text-white mb-2">Únete a la comunidad</h3>
                            <p class="text-sm text-gray-400 mb-4">Conecta con otros cinéfilos y comparte tus películas favoritas</p>
                            <div class="space-y-2">
                                <RouterLink to="/register"
                                    class="block w-full px-4 py-2 bg-[#EFB810] text-black font-semibold rounded-lg hover:bg-yellow-400 transition">
                                    Registrarse
                                </RouterLink>
                                <RouterLink to="/login"
                                    class="block w-full px-4 py-2 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition">
                                    Iniciar sesión
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Info adicional -->
                        <div class="bg-[#1C1C1C] border border-gray-800 rounded-lg p-4">
                            <h3 class="font-semibold text-white mb-3">Acerca de Underground Cinema</h3>
                            <p class="text-sm text-gray-400 leading-relaxed">
                                Una comunidad dedicada al cine alternativo, independiente y de culto.
                                Descubre joyas ocultas y conecta con otros amantes del séptimo arte.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
