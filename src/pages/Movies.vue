<script>
import { ref, onMounted } from 'vue'
import { getMovies } from '../services/movies'
const movies = ref([])
onMounted(async () => {
    movies.value = await getMovies()
})
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="movie in movies" :key="movie.id" class="card">
            <img :src="movie.poster_url" alt="" class="w-full h-64 object-cover" />
            <h2 class="text-xl font-bold">{{ movie.title }}</h2>
            <p class="text-sm text-gray-500">Publicado por: {{ movie.publicado_por }}</p>
            <RouterLink :to="`/pelicula/${movie.id}`" class="text-blue-500 underline">Ver detalles</RouterLink>
        </div>
    </div>
</template>
