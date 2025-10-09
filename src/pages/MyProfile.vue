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
    <section class="pt-24 px-6 bg-[#121212] text-white min-h-screen">
        <div class="max-w-5xl mx-auto">
            <!-- CABECERA PERFIL -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-700 pb-6">
                <!-- Avatar -->
                <div class="relative w-32 h-32">
                    <img :src="user.avatar_url || '/default-avatar.png'" alt="Avatar"
                        class="w-32 h-32 rounded-full object-cover border-4 border-[#EFB810]" />
                    <button @click="goToEditProfile"
                        class="absolute bottom-0 right-0 bg-[#EFB810] text-black rounded-full p-2 hover:bg-yellow-400 transition"
                        title="Editar perfil">
                        ✏️
                    </button>
                </div>

                <!-- Info -->
                <div class="flex-1 text-center md:text-left">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                        <h2 class="text-3xl font-bold text-[#EFB810]">{{ user.username || 'Usuario anónimo' }}</h2>
                        <span v-if="user.verified"
                            class="bg-blue-600 text-xs px-2 py-1 rounded-full text-white">Verificado</span>
                    </div>

                    <p class="text-gray-400 text-sm mt-1">{{ user.email }}</p>
                    <p class="text-gray-300 mt-2">{{ user.bio || 'Sin descripción todavía...' }}</p>

                    <div class="flex justify-center md:justify-start gap-6 mt-4 text-sm text-gray-400">
                        <div><span class="font-bold text-white">{{ movies.length }}</span> publicaciones</div>
                        <div><span class="font-bold text-white">128</span> seguidores</div>
                        <div><span class="font-bold text-white">97</span> seguidos</div>
                    </div>

                    <p class="text-sm text-gray-500 mt-3">
                        📍 {{ user.location || 'Ubicación no especificada' }}
                    </p>

                    <div class="mt-4 flex gap-2 flex-wrap text-sm text-gray-400">
                        <span v-if="user.favorite_genres">🎬 <b>Géneros:</b> {{ user.favorite_genres }}</span>
                        <span v-if="user.favorite_directors">🎥 <b>Directores:</b> {{ user.favorite_directors }}</span>
                    </div>
                </div>
            </div>

            <!-- PUBLICACIONES -->
            <div class="mt-10">
                <h3 class="text-2xl font-semibold text-[#EFB810] mb-4 text-center md:text-left">Publicaciones</h3>

                <div v-if="movies.length" class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                    <div v-for="movie in movies" :key="movie.id"
                        class="aspect-square bg-[#1C1C1C] border border-gray-700 rounded overflow-hidden hover:opacity-80 transition">
                        <RouterLink :to="'/movies/' + movie.id">
                            <img :src="movie.poster" :alt="movie.titulo" class="w-full h-full object-cover" />
                        </RouterLink>
                    </div>
                </div>

                <p v-else class="text-gray-500 text-center mt-10">Todavía no publicaste películas.</p>
            </div>

            <!-- BOTÓN CERRAR SESIÓN -->
            <div class="mt-10 flex justify-center">
                <button @click="handleLogout"
                    class="px-6 py-2 border border-[#EFB810] rounded text-[#EFB810] font-semibold hover:bg-[#EFB810] hover:text-black transition">
                    Cerrar sesión
                </button>
            </div>
        </div>
    </section>
</template>
