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
    <div
        class="bg-[#1C1C1C] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition hover:scale-[1.02] border border-gray-800">
        <img :src="movie.poster" :alt="movie.titulo" class="w-full h-72 object-cover">
        <div class="p-4">
            <h3 class="text-xl font-semibold mb-2 text-[#EFB810]">{{ movie.titulo }}</h3>
            <p class="text-gray-400 text-sm">{{ movie.descripcion.substring(0, 100) }}...</p>
            <RouterLink :to="'/movies/' + movie.id"
                class="inline-block mt-4 px-4 py-2 border border-[#EFB810] rounded text-[#EFB810] hover:bg-[#EFB810] hover:text-black transition text-sm font-semibold">
                Ver más</RouterLink>
        </div>
    </div>
</template>
