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
    <section class="p-6 mt-20">
        <h2 class="text-3xl font-bold mb-6 text-center">Películas de Culto</h2>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>
    </section>
</template>

