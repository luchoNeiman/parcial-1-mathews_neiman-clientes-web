<script>
import { supabase } from '../services/supabase.js';

export default {
    name: 'CommentForm',
    props: {
        movieId: Number,
    },
    data() {
        return {
            comment: '',
            comments: [],
        };
    },
    methods: {
        async fetchComments() {
            const { data } = await supabase
                .from('comentarios')
                .select('*')
                .eq('movie_id', this.movieId);
            this.comments = data || [];
        },
        async submitComment() {
            if (!this.comment.trim()) return;
            const { error } = await supabase
                .from('comentarios')
                .insert({ movie_id: this.movieId, user: 'Anónimo', texto: this.comment });
            if (!error) {
                this.comment = '';
                this.fetchComments();
            }
        },
    },
    mounted() {
        this.fetchComments();
    },
};
</script>

<template>
    <div class="w-full mt-6">
        <h3 class="font-semibold mb-2">Dejá tu comentario:</h3>
        <textarea v-model="comment" class="w-full border border-gray-700 p-2 rounded bg-transparent text-white"
            placeholder="Escribí algo..."></textarea>
        <button @click="submitComment" class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            Enviar
        </button>

        <div v-if="comments.length" class="mt-4">
            <h4 class="font-semibold mb-2">Comentarios:</h4>
            <ul>
                <li v-for="c in comments" :key="c.id" class="border-b border-gray-700 py-2">
                    <strong>{{ c.user }}</strong>: {{ c.texto }}
                </li>
            </ul>
        </div>
    </div>
</template>
