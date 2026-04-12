<script>
import { supabase } from '../services/supabase'
import { subscribeToAuthStateChanges } from '../services/auth'

export default {
    name: 'MovieCard',
    props: {
        movie: {
            type: Object,
            required: true,
        },
        size: {
            type: String,
            default: 'default',
        },
    },
    data() {
        return {
            user: { id: null, username: null },
            liked: false,
            likesCount: 0,
            comments: [],
            newComment: '',
        }
    },
    computed: {
        isCompact() {
            return this.size === 'compact'
        },
    },
    methods: {
        async fetchLikes() {
            const { count, error } = await supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('movie_id', this.movie.id)

            if (!error) this.likesCount = count || 0
        },

        async checkIfLiked() {
            if (!this.user.id) return
            const { data } = await supabase
                .from('likes')
                .select('*')
                .eq('movie_id', this.movie.id)
                .eq('user_id', this.user.id)
                .maybeSingle()

            this.liked = !!data
        },

        async toggleLike() {
            if (!this.user.id) return alert('Iniciá sesión para dar like.')

            if (this.liked) {
                await supabase
                    .from('likes')
                    .delete()
                    .eq('movie_id', this.movie.id)
                    .eq('user_id', this.user.id)
                this.likesCount--
            } else {
                await supabase.from('likes').insert({
                    movie_id: this.movie.id,
                    user_id: this.user.id,
                })
                this.likesCount++
            }

            this.liked = !this.liked
        },

        async fetchComments() {
            const { data, error } = await supabase
                .from('comments')
                .select('*, user_profiles(username, avatar_url)')
                .eq('movie_id', this.movie.id)
                .order('created_at', { ascending: true })

            if (!error) this.comments = data
        },

        async postComment() {
            if (!this.newComment.trim()) return
            if (!this.user.id) return alert('Iniciá sesión para comentar.')

            const { error } = await supabase.from('comments').insert({
                movie_id: this.movie.id,
                user_id: this.user.id,
                content: this.newComment.trim(),
            })

            if (!error) {
                this.newComment = ''
                await this.fetchComments()
            }
        },

        getProfileLink(userId) {
            return this.user.id === userId ? '/mi-perfil' : `/usuario/${userId}`
        }
    },
    async mounted() {
        subscribeToAuthStateChanges((newUser) => (this.user = newUser))
        await this.fetchLikes()
        await this.fetchComments()
        await this.checkIfLiked()
    },
}
</script>

<template>
    <article :class="[
        'bg-[#1C1C1C] rounded-xl shadow-md border border-gray-700 overflow-hidden w-full mx-auto',
        isCompact ? 'max-w-2xl' : 'max-w-3xl'
    ]">
        <div :class="[
            'flex items-center gap-3 border-b border-gray-700',
            isCompact ? 'p-2.5' : 'p-3'
        ]">
            <RouterLink :to="getProfileLink(movie.user_id)" class="flex items-center gap-3 hover:opacity-80 transition">
                <img :src="movie.user_profiles?.avatar_url || '/default-avatar.png'"
                    loading="lazy" :class="[
                        'rounded-full object-cover border border-[#EFB810]',
                        isCompact ? 'w-9 h-9' : 'w-10 h-10'
                    ]" />
                <div>
                    <p :class="[
                        'font-semibold text-[#EFB810]',
                        isCompact ? 'text-sm' : 'text-base'
                    ]">
                        {{ movie.user_profiles?.username || 'Anónimo' }}
                    </p>
                    <p class="text-xs text-gray-400">
                        {{ new Date(movie.created_at).toLocaleDateString() }}
                    </p>
                </div>
            </RouterLink>
        </div>

        <RouterLink :to="'/movies/' + movie.id">
            <img :src="movie.poster" :alt="movie.titulo" loading="lazy" :class="[
                'w-full object-cover',
                isCompact ? 'max-h-[420px]' : 'max-h-[600px]'
            ]" />
        </RouterLink>

        <div :class="isCompact ? 'px-3.5 pt-3' : 'px-4 pt-3'">
            <RouterLink :to="'/movies/' + movie.id" class="block hover:opacity-90 transition">
                <h3 :class="[
                    'font-bold text-white leading-tight',
                    isCompact ? 'text-base' : 'text-lg'
                ]">
                    {{ movie.titulo || 'Película o serie sin título' }}
                </h3>
            </RouterLink>
        </div>

        <div :class="[
            'flex items-center px-4',
            isCompact ? 'gap-4 py-2.5' : 'gap-6 py-3'
        ]">
            <button @click="toggleLike" :class="['focus:outline-none', isCompact ? 'text-xl' : 'text-2xl']">
                <i :class="liked ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-gray-300'"></i>
            </button>
            <span class="text-gray-400 text-sm">{{ likesCount }} me gusta</span>
        </div>

        <div :class="isCompact ? 'px-3.5 pb-2' : 'px-4 pb-2'">
            <p class="text-white text-sm leading-snug">
                <RouterLink :to="getProfileLink(movie.user_id)" class="font-semibold text-[#EFB810] mr-2 hover:text-yellow-400 transition">{{
                    movie.user_profiles?.username || 'Anónimo'
                    }}</RouterLink>
                {{ movie.description }}
            </p>
        </div>

        <div :class="['text-sm', isCompact ? 'px-3.5 pb-3' : 'px-4 pb-3']">
            <div v-if="!comments.length" class="text-gray-500 italic text-center border-t border-gray-700 pt-3 flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                </svg>
                <span>Sé el primero en comentar</span>
            </div>

            <div v-for="comment in comments" :key="comment.id" class="border-t border-gray-700 pt-2 mt-2 flex gap-2">
                <img :src="comment.user_profiles?.avatar_url || '/default-avatar.png'"
                    class="w-6 h-6 rounded-full border border-gray-700 object-cover" />
                <p>
                    <span class="font-semibold text-[#EFB810]">{{
                        comment.user_profiles?.username
                        }}</span>
                    {{ comment.content }}
                </p>
            </div>
        </div>

        <div :class="[
            'border-t border-gray-700 flex items-center gap-2',
            isCompact ? 'p-2.5' : 'p-3'
        ]">
            <input v-model="newComment" type="text" placeholder="Agregá un comentario..."
                class="flex-1 bg-transparent border-none text-sm text-gray-300 focus:outline-none"
                @keyup.enter="postComment" />
            <button @click="postComment" class="text-[#EFB810] text-sm font-semibold hover:text-yellow-400">
                Publicar
            </button>
        </div>
    </article>
</template>

<style scoped>
.fa-heart {
    transition: transform 0.2s ease;
}

.fa-heart:hover {
    transform: scale(1.2);
}
</style>
