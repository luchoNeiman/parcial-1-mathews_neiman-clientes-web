<script>
import LikeButton from './LikeButton.vue';

export default {
    name: 'MovieCard',
    components: { LikeButton },
    props: {
        movie: Object,
    },
};
</script>

<template>
    <div class="border border-gray-700 p-4 rounded-md flex flex-col items-center">
        <img :src="movie.poster" :alt="movie.titulo" class="w-full h-64 object-cover rounded" />
        <h2 class="text-lg font-semibold mt-2">{{ movie.titulo }}</h2>

        <div class="flex justify-between items-center w-full mt-3">
            <router-link :to="'/movies/' + movie.id" class="text-blue-400 hover:underline">
                Ver detalles
            </router-link>

            <LikeButton :movieId="movie.id" />
        </div>
    </div>
</template>


