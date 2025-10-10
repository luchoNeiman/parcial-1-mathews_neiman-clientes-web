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

        if (error) {
        }
        this.movies = data || []
    },
}
</script>

<template>
    <section class="p-6 mt-24 bg-[#121212] text-white min-h-screen relative">
        <div class="flex items-center justify-center gap-3 mb-8">
            <svg class="w-8 h-8 text-[#EFB810]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
            <h2 class="text-3xl font-bold text-center text-[#EFB810] drop-shadow-md">
                Publicaciones recientes
            </h2>
        </div>

        <div class="flex flex-col gap-10 max-w-3xl mx-auto">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>

        <RouterLink to="/movies/crear"
            class="fixed bottom-8 right-8 bg-[#EFB810] text-black w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-yellow-400 transition z-50">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </RouterLink>
    </section>
</template>
