<script>
import { getUserProfileById } from '../services/user-profiles'

export default {
    name: 'UserProfile',
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true
            // Obtenemos el ID del usuario desde la URL
            const userId = this.$route.params.id
            this.user = await getUserProfileById(userId)
        } catch (error) {
            console.error('[UserProfile.vue] Error al cargar el perfil del usuario:', error)
        } finally {
            this.loading = false
        }
    },
}
</script>

<template>
    <section class="pt-24 px-6 min-h-screen flex flex-col items-center bg-[#121212] text-white">
        <!-- Loader -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#EFB810] border-t-transparent"></div>
        </div>

        <!-- Contenido del perfil -->
        <div v-else class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
            <div class="flex justify-center mb-4">
                <div
                    class="w-24 h-24 rounded-full bg-gradient-to-b from-[#EFB810] to-[#7c6500] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                        class="w-12 h-12 text-black">
                        <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4z" />
                        <path d="M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z" />
                    </svg>
                </div>
            </div>

            <h2 class="text-2xl font-bold text-[#EFB810] mb-2">
                {{ user.display_name || 'Usuario anónimo' }}
            </h2>

            <p class="text-gray-400 mb-4 text-sm">{{ user.email }}</p>

            <p class="text-gray-300 italic mb-4">
                {{ user.bio || 'Sin biografía disponible...' }}
            </p>

            <p class="text-sm text-gray-500 mb-6">
                Carrera: {{ user.career || 'No especificada' }}
            </p>

            <RouterLink to="/chat"
                class="px-4 py-2 border border-[#EFB810] text-[#EFB810] rounded font-semibold hover:bg-[#EFB810] hover:text-black transition">
                Volver al chat
            </RouterLink>
        </div>
    </section>
</template>

<style scoped>
/* Pequeña animación para el loader */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
