<script>
import { getUserProfileById } from '../services/user-profiles'
import { supabase } from '../services/supabase'

export default {
    name: 'UserProfile',
    data() {
        return {
            user: {},
            movies: [],
            loading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true
            const userId = this.$route.params.id
            this.user = await getUserProfileById(userId)
            await this.fetchMovies(userId)
        } catch (error) {
            console.error('Error al cargar el perfil del usuario:', error)
        } finally {
            this.loading = false
        }
    },
    methods: {
        async fetchMovies(userId) {
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('user_id', userId)
            if (error) console.error(error.message)
            this.movies = data || []
        },
    },
}
</script>

<template>
    <section class="pt-24 px-6 bg-[#121212] text-white min-h-screen">
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#EFB810] border-t-transparent"></div>
        </div>

        <div v-else class="max-w-5xl mx-auto">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-700 pb-6">
                <img :src="user.avatar_url || '/default-avatar.png'" alt="Avatar"
                    class="w-32 h-32 rounded-full object-cover border-4 border-[#EFB810]" />

                <div class="flex-1 text-center md:text-left">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                        <h2 class="text-3xl font-bold text-[#EFB810]">{{ user.username }}</h2>
                        <span v-if="user.verified"
                            class="bg-blue-600 text-xs px-2 py-1 rounded-full text-white">Verificado</span>
                    </div>

                    <p class="text-gray-400 text-sm mt-1">{{ user.email }}</p>
                    <p class="text-gray-300 mt-2">{{ user.bio || 'Sin descripción...' }}</p>

                    <div class="flex justify-center md:justify-start gap-6 mt-4 text-sm text-gray-400">
                        <div><span class="font-bold text-white">{{ movies.length }}</span> publicaciones</div>
                        <div><span class="font-bold text-white">75</span> seguidores</div>
                        <div><span class="font-bold text-white">60</span> seguidos</div>
                    </div>

                    <p class="text-sm text-gray-500 mt-3">
                        📍 {{ user.location || 'Ubicación no especificada' }}
                    </p>
                </div>
            </div>

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

                <p v-else class="text-gray-500 text-center mt-10">Este usuario no tiene publicaciones.</p>
            </div>
        </div>
    </section>
</template>
