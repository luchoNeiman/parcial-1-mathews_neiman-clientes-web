<script>
import { supabase } from '../services/supabase.js'
import { useRoute } from 'vue-router'
import CommentForm from '../components/CommentForm.vue'

export default {
    name: 'MovieDetail',
    components: { CommentForm },
    data() {
        return {
            movie: null,
        }
    },
    async created() {
        const route = useRoute()
        const movieId = route.params.id
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('id', movieId)
            .single()

        if (error) console.error('Error al cargar película:', error.message)
        this.movie = data
    },
}
</script>


<template>
    <section class="p-6 max-w-4xl mx-auto">
        <div v-if="movie" class="flex flex-col gap-4">
            <img :src="movie.poster" :alt="movie.titulo" class="w-full rounded shadow" />
            <h2 class="text-3xl font-bold">{{ movie.titulo }}</h2>
            <p class="text-gray-300">{{ movie.descripcion }}</p>
            <p class="text-sm text-gray-500">Director: {{ movie.director }} — Año: {{ movie.anio }}</p>

            <iframe v-if="movie.trailer" :src="movie.trailer" frameborder="0" allowfullscreen
                class="w-full h-64 md:h-96 mt-4"></iframe>

            <CommentForm :movieId="movie.id" />
        </div>

        <div v-else class="text-center py-10 text-gray-500">
            Cargando datos de la película...
        </div>
    </section>
</template>
