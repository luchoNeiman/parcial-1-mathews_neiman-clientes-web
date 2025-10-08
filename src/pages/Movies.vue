<script>
import { supabase } from '../services/supabase.js'
import MovieCard from '../components/MovieCard.vue'

export default {
    name: 'Movies',
    components: { MovieCard },
    data() {
        return { movies: [] }
    },
    async created() {
        const { data, error } = await supabase
            .from('movies')
            .select('*, user_profiles(username, avatar_url)')
            .order('created_at', { ascending: false })

        if (error) console.error('Error al cargar películas:', error.message)
        this.movies = data || []
    },
}
</script>

<template>
    <section class="p-6 mt-24 bg-[#121212] text-white min-h-screen relative">
        <h2 class="text-4xl font-bold mb-8 text-center text-[#EFB810] drop-shadow-md">🎬 Películas de Culto</h2>

        <!-- <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" /> -->
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div v-for="movie in movies" :key="movie.id"
                class="bg-[#1C1C1C] rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <img :src="movie.poster" :alt="movie.titulo" class="w-full h-64 object-cover" />
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-[#EFB810] mb-2">{{ movie.titulo }}</h3>
                    <p class="text-gray-300 text-sm mb-4">{{ movie.description }}</p>
                    <div class="flex items-center">
                        <img :src="movie.user_profiles.avatar_url || '/default-avatar.png'" alt="Avatar"
                            class="w-8 h-8 rounded-full mr-2 border-2 border-[#EFB810]" />
                        <span class="text-gray-400 text-sm">{{ movie.user_profiles.username || 'Anónimo' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón flotante para crear publicación -->
        <RouterLink to="/movies/crear"
            class="fixed bottom-8 right-8 bg-[#EFB810] text-black w-14 h-14 flex items-center justify-center text-3xl rounded-full shadow-lg hover:bg-yellow-400 transition z-50">
            +
        </RouterLink>

    </section>
</template>
