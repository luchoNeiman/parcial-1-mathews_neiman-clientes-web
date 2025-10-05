<script>
// import AppH1 from '../components/AppH1.vue';
// import { register } from '../services/auth';

export default {
    name: 'Register',
    // components: { AppH1, },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;

                await register(this.user.email, this.user.password);

                this.$router.push('/mi-perfil');
            } catch (error) {
                // TODO:
            }
            this.loading = false;
        }
    }
}
</script>

<template>
    <AppH1>Crear una nueva cuenta</AppH1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded" v-model="user.email">
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-1">Contraseña</label>
            <input type="password" id="password" class="w-full p-2 border border-gray-300 rounded"
                v-model="user.password">
        </div>
        <button type="submit"
            class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Crear
            cuenta</button>
    </form>
</template>