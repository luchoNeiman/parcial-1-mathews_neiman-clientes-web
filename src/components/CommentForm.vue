<script>
import { supabase } from '../services/supabase.js'

export default {
    name: 'CommentForm',
    props: {
        movieId: Number,
    },
    data() {
        return {
            comment: '',
            comments: [],
            subscription: null,
        }
    },
    methods: {
        async fetchComments() {
            const { data, error } = await supabase
                .from('comentarios')
                .select('*')
                .eq('movie_id', this.movieId)
                .order('created_at', { ascending: true })
            if (error) console.error(error.message)
            this.comments = data || []
        },

        async submitComment() {
            if (!this.comment.trim()) return
            const { error } = await supabase
                .from('comentarios')
                .insert({
                    movie_id: this.movieId,
                    user: 'Anónimo',
                    texto: this.comment.trim(),
                })
            if (error) console.error(error.message)
            this.comment = ''
        },

        subscribeToRealtime() {
            this.subscription = supabase
                .channel('comentarios-stream')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'comentarios',
                        filter: `movie_id=eq.${this.movieId}`,
                    },
                    (payload) => {
                        this.comments.push(payload.new)
                    }
                )
                .subscribe()
        },
    },

    async created() {
        await this.fetchComments()
        this.subscribeToRealtime()
    },

    beforeUnmount() {
        if (this.subscription) this.subscription.unsubscribe()
    },
}
</script>


<template>
    <div class="w-full mt-6">
        <h3 class="font-semibold mb-2">Dejá tu comentario:</h3>

        <!-- Formulario -->
        <textarea v-model="comment" class="w-full border border-gray-700 p-2 rounded bg-transparent text-white"
            placeholder="Escribí algo..."></textarea>

        <button @click="submitComment" class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            Enviar
        </button>

        <!-- Comentarios -->
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
