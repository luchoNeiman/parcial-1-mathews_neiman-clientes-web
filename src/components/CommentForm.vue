<script>
import { supabase } from '../services/supabase.js'
import { subscribeToAuthStateChanges } from '../services/auth.js'

export default {
    name: 'CommentForm',
    props: {
        movieId: String,
    },
    data() {
        return {
            comment: '',
            comments: [],
            subscription: null,
            user: null,
        }
    },
    methods: {
        async fetchComments() {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id, content, created_at,
                    user_id,
                    user_profiles (
                        username, avatar_url
                    )
                `)
                .eq('movie_id', this.movieId)
                .order('created_at', { ascending: true })

            if (error) {
            }
            this.comments = data || []
        },

        async submitComment() {
            if (!this.comment.trim() || !this.user) return

            const { error } = await supabase
                .from('comments')
                .insert({
                    movie_id: this.movieId,
                    user_id: this.user.id,
                    content: this.comment.trim(),
                })

            if (error) {
            }
            this.comment = ''
        },

        subscribeToRealtime() {
            this.subscription = supabase
                .channel('comments-stream')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'comments',
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
        subscribeToAuthStateChanges((newUser) => (this.user = newUser))
        await this.fetchComments()
        this.subscribeToRealtime()
    },

    beforeUnmount() {
        if (this.subscription) this.subscription.unsubscribe()
    },
}
</script>

<template>
    <div class="w-full mt-6 text-white">
        <h3 class="font-semibold mb-2 text-[#EFB810]">Dejá tu comentario:</h3>

        <textarea v-model="comment" class="w-full border border-gray-700 p-2 rounded bg-transparent text-white"
            placeholder="Escribí algo..."></textarea>

        <button @click="submitComment"
            class="mt-2 px-4 py-2 bg-[#EFB810] hover:bg-yellow-400 text-black font-semibold rounded transition">
            Enviar
        </button>

        <div v-if="comments.length" class="mt-6">
            <h4 class="font-semibold mb-2 text-[#EFB810]">Comentarios:</h4>
            <ul>
                <li v-for="c in comments" :key="c.id" class="border-b border-gray-700 py-3 flex items-start gap-3">
                    <img v-if="c.user_profiles?.avatar_url" :src="c.user_profiles.avatar_url"
                        class="w-10 h-10 rounded-full" />
                    <div>
                        <p class="text-sm font-semibold text-[#EFB810]">
                            {{ c.user_profiles?.username || 'Usuario anónimo' }}
                        </p>
                        <p class="text-gray-300">{{ c.content }}</p>
                        <p class="text-xs text-gray-500">
                            {{ new Date(c.created_at).toLocaleString() }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
