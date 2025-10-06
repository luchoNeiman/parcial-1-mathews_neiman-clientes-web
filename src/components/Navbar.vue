<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';

export default {
    name: 'Navbar',
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/login');
        },
    },
    mounted() {
        subscribeToAuthStateChanges(newUserState => this.user = newUserState);
    },
};
</script>

<template>
    <nav class="flex justify-between items-center px-6 py-4 bg-[#121212] border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <!-- LOGO -->
        <RouterLink to="/" class="text-[#EFB810] text-2xl font-bold tracking-wide hover:text-yellow-400 transition">
            Underground Cinema
        </RouterLink>

        <!-- LINKS -->
        <ul class="flex items-center gap-6 text-gray-300">
            <li>
                <RouterLink to="/" class="hover:text-[#EFB810] transition">
                    Inicio
                </RouterLink>
            </li>

            <li>
                <RouterLink to="/movies" class="hover:text-[#EFB810] transition">
                    Películas
                </RouterLink>
            </li>

            <li>
                <RouterLink to="/soundtracks" class="hover:text-[#EFB810] transition">
                    Bandas Sonoras
                </RouterLink>
            </li>

            <template v-if="user.id === null">
                <!-- BOTÓN INGRESAR -->
                <li>
                    <RouterLink to="/login"
                        class="px-4 py-2 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition">
                        Ingresar
                    </RouterLink>
                </li>

                <!-- BOTÓN REGISTRARSE -->
                <li>
                    <RouterLink to="/register"
                        class="px-4 py-2 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition">
                        Registrarse
                    </RouterLink>
                </li>
            </template>

            <template v-else>
                <!-- CHAT -->
                <li>
                    <RouterLink to="/chat" class="hover:text-[#EFB810] transition">
                        Chat Global
                    </RouterLink>
                </li>

                <!-- ICONO DE PERFIL -->
                <li>
                    <RouterLink to="/mi-perfil"
                        class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-[#EFB810] hover:text-[#EFB810] transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                            <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4z" />
                            <path d="M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z" />
                        </svg>
                    </RouterLink>
                </li>

                <!-- BOTÓN CERRAR SESIÓN -->
                <li>
                    <form @submit.prevent="handleLogout">
                        <button type="submit"
                            class="px-4 py-2 border border-[#EFB810] rounded text-[#EFB810] font-semibold hover:bg-[#EFB810] hover:text-black transition">
                            Cerrar sesión
                        </button>
                    </form>
                </li>
            </template>

        </ul>
    </nav>
</template>
