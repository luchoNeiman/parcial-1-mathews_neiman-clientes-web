<script>
import { register } from '../services/auth'

export default {
    name: 'Register',
    components: {  },
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
                await register(this.user.email, this.user.password)
                this.$router.push('/mi-perfil')
            } catch (error) {
                console.error('[Register.vue] Error al registrarse:', error)
                this.errorMessage = 'No se pudo crear la cuenta. Verificá los datos.'
            } finally {
                this.loading = false
            }
        },
    },
}
</script>

<template>
    <section class="max-w-md mx-auto p-6 bg-[#121212] border border-gray-800 rounded-lg shadow-md text-white mt-50">
        <h1 class="text-center mb-6">Crear una nueva cuenta</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div>
                <label for="email" class="block mb-1 text-gray-300">Email</label>
                <input type="email" id="email" v-model="user.email" required
                    class="w-full p-2 border border-gray-700 rounded bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-[#EFB810]" />
            </div>

            <div>
                <label for="password" class="block mb-1 text-gray-300">Contraseña</label>
                <input type="password" id="password" v-model="user.password" required minlength="6"
                    class="w-full p-2 border border-gray-700 rounded bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-[#EFB810]" />
            </div>

            <div v-if="errorMessage" class="text-red-500 text-sm">
                {{ errorMessage }}
            </div>

            <button type="submit" :disabled="loading"
                class="transition px-4 py-2 rounded bg-[#EFB810] hover:bg-yellow-400 active:bg-yellow-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
                
            </button>

            <p class="text-sm text-gray-400 mt-4 text-center">
                ¿Ya tenés una cuenta?
                <RouterLink to="/login" class="text-[#EFB810] hover:underline">Iniciá sesión</RouterLink>
            </p>
        </form>
    </section>
</template>
