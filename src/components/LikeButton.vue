<script>
import { supabase } from '../services/supabase.js';

export default {
    name: 'LikeButton',
    props: {
        movieId: Number,
    },
    data() {
        return {
            liked: false,
            likeCount: 0,
        };
    },
    methods: {
        async fetchLikes() {
            const { data } = await supabase
                .from('likes')
                .select('id', { count: 'exact' })
                .eq('movie_id', this.movieId);
            this.likeCount = data.length;
        },
        async toggleLike() {
            if (this.liked) {
                await supabase
                    .from('likes')
                    .delete()
                    .match({ movie_id: this.movieId });
                this.likeCount--;
            } else {
                await supabase
                    .from('likes')
                    .insert({ movie_id: this.movieId });
                this.likeCount++;
            }
            this.liked = !this.liked;
        },
    },
    mounted() {
        this.fetchLikes();
    },
};
</script>



<template>
    <button class="flex items-center gap-2" @click="toggleLike">
        <span :class="liked ? 'text-red-500' : 'text-gray-400'">♥</span>
        <span class="text-sm">{{ likeCount }}</span>
    </button>
</template>
