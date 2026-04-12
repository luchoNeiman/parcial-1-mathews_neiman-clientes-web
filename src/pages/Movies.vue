<script>
import { supabase } from '../services/supabase.js'
import MovieCard from '../components/MovieCard.vue'

export default {
    name: 'Movies',
    components: { MovieCard },
    data() {
        return {
            movies: [],
            searchQuery: '',
            searchBy: 'title',
        }
    },
    computed: {
        filteredMovies() {
            const query = this.normalizeText(this.searchQuery)
            if (!query) return this.movies

            return this.movies.filter((movie) => {
                const title = this.normalizeText(movie.titulo || '')
                const author = this.normalizeText(movie.user_profiles?.username || '')

                if (this.searchBy === 'author') {
                    return author.includes(query)
                }

                if (this.searchBy === 'all') {
                    return title.includes(query) || author.includes(query)
                }

                return title.includes(query)
            })
        },
    },
    methods: {
        normalizeText(value) {
            return value
                .toString()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim()
        },
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
                Publicaciones recientes de películas y series
            </h2>
        </div>

        <div class="max-w-3xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <div class="relative">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar por nombre..."
                    class="w-full rounded-lg border border-gray-700 bg-[#1C1C1C] px-4 py-3 pr-10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#EFB810]"
                />
                <svg class="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>

            <select
                v-model="searchBy"
                class="rounded-lg border border-gray-700 bg-[#1C1C1C] px-4 py-3 text-gray-100 focus:outline-none focus:border-[#EFB810]"
            >
                <option value="title">Filtrar: nombre</option>
                <option value="author">Filtrar: publicado por</option>
                <option value="all">Filtrar: nombre o publicado por</option>
            </select>
        </div>

        <div class="flex flex-col gap-10 max-w-3xl mx-auto">
            <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" size="compact" />
        </div>

        <div v-if="!filteredMovies.length" class="max-w-3xl mx-auto mt-8 text-center text-gray-400">
            <p>No encontramos publicaciones para esa búsqueda.</p>
            <p class="text-sm text-gray-500 mt-1">Probá con otro nombre o con otro usuario.</p>
        </div>

        <RouterLink to="/movies/crear"
            class="fixed bottom-8 right-8 bg-[#EFB810] text-black w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-yellow-400 transition z-50">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </RouterLink>
    </section>
</template>
