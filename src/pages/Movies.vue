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
        <h2 class="text-3xl font-bold mb-8 text-center text-[#EFB810] drop-shadow-md">
            🎥 Publicaciones recientes
        </h2>

        <!-- Feed estilo Instagram -->
        <div class="flex flex-col gap-10 max-w-3xl mx-auto">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>

        <!-- Botón flotante para crear publicación -->
        <RouterLink to="/movies/crear"
            class="fixed bottom-8 right-8 bg-[#EFB810] text-black w-14 h-14 flex items-center justify-center text-3xl rounded-full shadow-lg hover:bg-yellow-400 transition z-50">
            +
        </RouterLink>
    </section>
</template>
