<script>
import { subscribeToAuthStateChanges, logout } from '../services/auth';

export default {
    name: 'MyProfile',
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        };
    },
    mounted() {
        subscribeToAuthStateChanges((newUserState) => (this.user = newUserState));
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/login');
        },
        goToEditProfile() {
            this.$router.push('/mi-perfil/editar');
        },
    },
};
</script>

<template>
    <section class="pt-24 px-6 flex flex-col items-center min-h-screen bg-[#121212] text-white">
        <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
            <!-- Avatar -->
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

            <!-- Datos del perfil -->
            <h2 class="text-2xl font-bold text-[#EFB810] mb-2">
                {{ user.display_name || 'Usuario anónimo' }}
            </h2>
            <p class="text-gray-400 mb-4">{{ user.email }}</p>
            <p class="text-gray-300 italic mb-4">{{ user.bio || 'Sin biografía por ahora...' }}</p>
            <p class="text-sm text-gray-500 mb-6">
                Carrera: {{ user.career || 'No especificada' }}
            </p>

            <!-- Botones -->
            <div class="flex flex-col gap-3">
                <button @click="goToEditProfile"
                    class="px-4 py-2 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition">
                    Editar perfil
                </button>

                <button @click="handleLogout"
                    class="px-4 py-2 border border-[#EFB810] rounded text-[#EFB810] hover:bg-[#EFB810] hover:text-black transition font-semibold">
                    Cerrar sesión
                </button>
            </div>
        </div>
    </section>
</template>
