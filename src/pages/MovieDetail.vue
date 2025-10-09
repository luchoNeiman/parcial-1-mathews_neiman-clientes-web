<script>
import { supabase } from '../services/supabase.js'
import { useRoute } from 'vue-router'
import { subscribeToAuthStateChanges } from '../services/auth.js'
import CommentForm from '../components/CommentForm.vue'
import LikeButton from '../components/LikeButton.vue'

let unsubscribeFromAuth = () => { }

export default {
    name: 'MovieDetail',
    components: { CommentForm, LikeButton },
    data() {
        return {
            movie: null,
            user: {
                id: null,
                email: null,
                username: null,
            },
        }
    },
    async created() {
        // 🟡 Obtener ID de la ruta
        const route = useRoute()
        const movieId = route.params.id

        // 🟢 Cargar datos de la película
        const { data, error } = await supabase
            .from('movies')
            .select('*, user_profiles(username, avatar_url)')
            .eq('id', movieId)
            .single()

        if (error) console.error('Error al cargar película:', error.message)
        this.movie = data

        // 🔵 Escuchar cambios de sesión
        unsubscribeFromAuth = subscribeToAuthStateChanges(
            (newUserState) => (this.user = newUserState)
        )
    },
    unmounted() {
        unsubscribeFromAuth()
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

                <!-- Botones de interacción -->
                <LikeButton :movieId="movie.id" class="mt-4" />
                <CommentForm :movieId="movie.id" class="mt-6" />

                <!-- Mostrar solo si el usuario logueado es el dueño -->
                <RouterLink v-if="user?.id && movie.user_id === user.id" :to="`/movies/editar/${movie.id}`"
                    class="px-4 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition mt-4 inline-block">
                    ✏️ Editar publicación
                </RouterLink>
            </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500">
            Cargando datos de la película...
        </div>
    </section>
</template>
