<script>
import { login } from '../services/auth'

export default {
    name: 'Login',
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
            errorMessage: '',
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true
            this.errorMessage = ''

            try {
                await login(this.user.email, this.user.password)
                this.$router.push('/mi-perfil')
            } catch (error) {
                this.errorMessage = 'Credenciales incorrectas o error al iniciar sesión.'
            } finally {
                this.loading = false
            }
        },
    },
}
</script>

<template>
    <section class="max-w-md mx-auto p-6 bg-[#121212] border border-gray-800 rounded-lg shadow-md text-white mt-28">
        <h1 class="text-center text-2xl font-semibold mb-6 text-[#EFB810]">Iniciar sesión</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div>
                <label for="email" class="block mb-1 text-gray-300">Email</label>
                <input type="email" id="email" v-model="user.email" required
                    class="w-full p-2 border border-gray-700 rounded bg-transparent text-white focus:ring-1 focus:ring-[#EFB810]" />
            </div>

            <div>
                <label for="password" class="block mb-1 text-gray-300">Contraseña</label>
                <input type="password" id="password" v-model="user.password" required minlength="6"
                    class="w-full p-2 border border-gray-700 rounded bg-transparent text-white focus:ring-1 focus:ring-[#EFB810]" />
            </div>

            <div v-if="errorMessage" class="text-red-500 text-sm text-center">
                {{ errorMessage }}
            </div>

            <button type="submit" :disabled="loading"
                class="px-4 py-2 rounded bg-[#EFB810] hover:bg-yellow-400 text-black font-semibold transition disabled:opacity-50">
                {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>

            <p class="text-sm text-gray-400 mt-4 text-center">
                ¿No tenés cuenta?
                <RouterLink to="/register" class="text-[#EFB810] hover:underline">Registrate</RouterLink>
            </p>
        </form>
    </section>
</template>
