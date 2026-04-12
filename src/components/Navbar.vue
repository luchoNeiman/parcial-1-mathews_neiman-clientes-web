<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';

export default {
    name: 'Navbar',
    data() {
        return {
            user: {
                id: null,
                email: null,
                username: null,
                avatar_url: null,
            },
            mobileMenuOpen: false,
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/login');
        },
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },
    },
    mounted() {
        subscribeToAuthStateChanges(newUserState => this.user = newUserState);
    },
};
</script>

<template>
    <nav class="bg-[#121212] border-b border-gray-800 fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-4">
            <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="/favicon.png" class="h-14" alt="Logo" />
                <span class="self-center text-xl font-semibold whitespace-nowrap text-[#EFB810] hover:text-yellow-400 transition hidden sm:block">
                    Underground
                </span>
            </RouterLink>

            <button @click="toggleMobileMenu" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>

            <div class="hidden w-full md:block md:w-auto">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent items-center">
                    <li class="md:flex md:items-center">
                        <RouterLink to="/"
                            class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-[#EFB810] md:p-0 transition md:flex md:items-center"
                            active-class="text-[#EFB810] bg-gray-700 md:bg-transparent">
                            Inicio
                        </RouterLink>
                    </li>
                    <li class="md:flex md:items-center">
                        <RouterLink to="/movies"
                            class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-[#EFB810] md:p-0 transition md:flex md:items-center"
                            active-class="text-[#EFB810] bg-gray-700 md:bg-transparent">
                            Películas y series
                        </RouterLink>
                    </li>

                    <template v-if="user.id === null">
                        <li>
                            <RouterLink to="/login"
                                class="block py-2 px-3 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition text-center">
                                Ingresar
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/register"
                                class="block py-2 px-3 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition text-center">
                                Registrarse
                            </RouterLink>
                        </li>
                    </template>

                    <template v-else>
                        <li>
                            <RouterLink to="/chat"
                                class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-[#EFB810] md:p-0 transition"
                                active-class="text-[#EFB810] bg-gray-700 md:bg-transparent">
                                Comunidad
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/mi-perfil"
                                class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-[#EFB810] hover:text-[#EFB810] transition mx-auto md:mx-0 overflow-hidden"
                                active-class="border-[#EFB810] text-[#EFB810] bg-[#1c1c1c]">
                                <img v-if="user.avatar_url"
                                    :src="user.avatar_url"
                                    alt="Avatar"
                                    class="w-full h-full object-cover rounded-full" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4z" />
                                    <path d="M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z" />
                                </svg>
                            </RouterLink>
                        </li>
                        <li>
                            <button @click="handleLogout"
                                class="block py-2 px-3 border border-[#EFB810] rounded text-[#EFB810] font-semibold hover:bg-[#EFB810] hover:text-black transition text-center">
                                Cerrar sesión
                            </button>
                        </li>
                    </template>
                </ul>
            </div>

            <div :class="{'hidden': !mobileMenuOpen}" class="w-full md:hidden">
                <ul class="font-medium flex flex-col p-4 mt-4 border border-gray-700 rounded-lg bg-gray-800 space-y-2">
                    <li>
                        <RouterLink to="/" @click="mobileMenuOpen = false"
                            class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 transition"
                            active-class="text-[#EFB810] bg-gray-700">
                            Inicio
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/movies" @click="mobileMenuOpen = false"
                            class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 transition"
                            active-class="text-[#EFB810] bg-gray-700">
                            Películas y series
                        </RouterLink>
                    </li>

                    <template v-if="user.id === null">
                        <li>
                            <RouterLink to="/login" @click="mobileMenuOpen = false"
                                class="block py-2 px-3 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition text-center">
                                Ingresar
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/register" @click="mobileMenuOpen = false"
                                class="block py-2 px-3 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition text-center">
                                Registrarse
                            </RouterLink>
                        </li>
                    </template>

                    <template v-else>
                        <li>
                            <RouterLink to="/chat" @click="mobileMenuOpen = false"
                                class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 transition"
                                active-class="text-[#EFB810] bg-gray-700">
                                Comunidad
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/mi-perfil" @click="mobileMenuOpen = false"
                                class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 transition"
                                active-class="text-[#EFB810] bg-gray-700">
                                Mi Perfil
                            </RouterLink>
                        </li>
                        <li>
                            <button @click="handleLogout; mobileMenuOpen = false"
                                class="block w-full py-2 px-3 border border-[#EFB810] rounded text-[#EFB810] font-semibold hover:bg-[#EFB810] hover:text-black transition text-center">
                                Cerrar sesión
                            </button>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>
