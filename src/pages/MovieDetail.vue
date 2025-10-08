<script>
import { supabase } from '../services/supabase.js'
import { useRoute } from 'vue-router'
import CommentForm from '../components/CommentForm.vue'
import LikeButton from '../components/LikeButton.vue'

export default {
    name: 'MovieDetail',
    components: { CommentForm, LikeButton },
    data() {
        return { movie: null }
    },
    async created() {
        const route = useRoute()
        const movieId = route.params.id

        const { data, error } = await supabase
            .from('movies')
            .select('*, user_profiles(username, avatar_url)')
            .eq('id', movieId)
            .single()

        if (error) console.error('Error al cargar película:', error.message)
        this.movie = data
    },
}
</script>

<template>
    <section class="p-6 pt-24 bg-[#121212] text-white min-h-screen">
        <div v-if="movie"
            class="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 bg-[#1C1C1C] p-6 rounded-lg border border-gray-700 shadow-xl">
            <img :src="movie.poster" :alt="movie.titulo" class="rounded-lg shadow-md w-full object-cover" />
            <div>
                <h2 class="text-3xl font-bold text-[#EFB810] mb-4">{{ movie.titulo }}</h2>
                <p class="text-gray-300 mb-4">{{ movie.description }}</p>

                <LikeButton :movieId="movie.id" class="mt-4" />
                <CommentForm :movieId="movie.id" class="mt-6" />
            </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500">Cargando datos de la película...</div>
    </section>
</template>
