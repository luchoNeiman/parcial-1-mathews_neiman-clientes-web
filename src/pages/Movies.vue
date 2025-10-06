<script>
import { supabase } from '../services/supabase.js'
import MovieCard from '../components/MovieCard.vue'

export default {
    name: 'Movies',
    components: { MovieCard },
    data() {
        return {
            movies: [],
        }
    },
    async created() {
        const { data, error } = await supabase.from('movies').select('*')
        if (error) console.error('Error al cargar películas:', error.message)
        this.movies = data || []
    },
}
</script>


<template>
    <section class="p-6 mt-24 bg-[#121212] text-white min-h-screen">
        <h2 class="text-4xl font-bold mb-8 text-center text-[#EFB810] drop-shadow-md">🎬 Películas de Culto</h2>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>
    </section>
</template>
