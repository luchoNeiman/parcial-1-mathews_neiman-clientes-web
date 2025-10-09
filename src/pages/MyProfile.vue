<script>
import { subscribeToAuthStateChanges, logout } from '../services/auth'
import { supabase } from '../services/supabase.js'

export default {
    name: 'MyProfile',
    data() {
        return {
            user: {
                id: null,
                email: null,
                username: null,
                bio: null,
                avatar_url: null,
                favorite_genres: null,
                favorite_directors: null,
                location: null,
                verified: false,
            },
            movies: [],
        }
    },
    mounted() {
        subscribeToAuthStateChanges(async (newUserState) => {
            this.user = newUserState
            await this.fetchMovies()
        })
    },
    methods: {
        async fetchMovies() {
            if (!this.user.id) return
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('user_id', this.user.id)
            if (error) console.error('Error al cargar películas del usuario:', error.message)
            this.movies = data || []
        },
        handleLogout() {
            logout()
            this.$router.push('/login')
        },
        goToEditProfile() {
            this.$router.push('/mi-perfil/editar')
        },
    },
}
</script>

<template>
    <section class="pt-20 bg-[#121212] text-white min-h-screen">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- CABECERA PERFIL -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 py-8 border-b border-gray-800">
                <!-- Avatar -->
                <div class="relative">
                    <div class="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                        <img :src="user.avatar_url || '/default-avatar.png'" alt="Avatar"
                            class="w-full h-full rounded-full object-cover bg-[#121212]" />
                    </div>
                    <button @click="goToEditProfile"
                        class="absolute -bottom-2 -right-2 bg-[#EFB810] text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-400 transition shadow-lg"
                        title="Editar perfil">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </button>
                </div>

                <!-- Info -->
                <div class="flex-1 text-center sm:text-left space-y-4">
                    <!-- Username y acciones -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                        <h1 class="text-xl sm:text-2xl font-light">{{ user.username || 'Usuario anónimo' }}</h1>
                        <div class="flex gap-2">
                            <button @click="goToEditProfile"
                                class="px-4 py-1.5 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-600 transition">
                                Editar perfil
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
                        <div class="text-center sm:text-left">
                            <span class="font-semibold">128</span>
                            <span class="text-gray-400 ml-1">seguidores</span>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="font-semibold">97</span>
                            <span class="text-gray-400 ml-1">seguidos</span>
                        </div>
                    </div>

                    <!-- Bio -->
                    <div class="space-y-2">
                        <p class="text-sm font-medium">{{ user.username || 'Usuario anónimo' }}</p>
                        <p class="text-sm text-gray-300">{{ user.bio || 'Sin descripción todavía...' }}</p>
                        <p class="text-sm text-gray-400" v-if="user.location">
                            📍 {{ user.location }}
                        </p>
                        <div class="flex flex-wrap gap-2 text-xs" v-if="user.favorite_genres || user.favorite_directors">
                            <span v-if="user.favorite_genres" class="bg-gray-800 px-2 py-1 rounded">
                                🎬 {{ user.favorite_genres }}
                            </span>
                            <span v-if="user.favorite_directors" class="bg-gray-800 px-2 py-1 rounded">
                                🎥 {{ user.favorite_directors }}
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
                            <!-- Overlay en hover para mostrar stats -->
                            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div class="flex items-center gap-4 text-white text-sm font-semibold">
                                    <div class="flex items-center gap-1">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>42</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>12</span>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>

                <!-- Estado vacío -->
                <div v-else class="text-center py-16 space-y-4">
                    <div class="w-16 h-16 mx-auto border-2 border-gray-600 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-light">Comparte tu primera película</h3>
                    <p class="text-gray-400 text-sm">Cuando compartas películas, aparecerán en tu perfil.</p>
                    <RouterLink to="/movies/crear"
                        class="inline-block px-6 py-2 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition">
                        Compartir tu primera película
                    </RouterLink>
                </div>
            </div>

            <!-- BOTÓN CERRAR SESIÓN -->
            <div class="py-8 flex justify-center border-t border-gray-800">
                <button @click="handleLogout"
                    class="px-6 py-2 text-red-400 hover:text-red-300 font-medium transition text-sm">
                    Cerrar sesión
                </button>
            </div>
        </div>
    </section>
</template>
