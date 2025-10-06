<script>
// import AppLoader from '../components/AppLoader.vue';
import { subscribeToAuthStateChanges, updateAuthUser } from '../services/auth';

let unsubscribeFromAuth = () => { };

export default {
    name: 'MyProfileEdit',
    // components: { AppLoader },
    data() {
        return {
            formData: {
                display_name: '',
                bio: '',
                career: '',
            },
            loading: false,
        };
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;
                await updateAuthUser(this.formData);

                // Redirige al perfil después de actualizar
                this.$router.push('/mi-perfil');
            } catch (error) {
                console.error('Error al actualizar el perfil:', error.message);
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuthStateChanges((newUserState) => {
            this.formData = {
                display_name: newUserState.display_name || '',
                bio: newUserState.bio || '',
                career: newUserState.career || '',
            };
        });
    },
    unmounted() {
        unsubscribeFromAuth();
    },
};
</script>

<template>
    <section class="pt-24 px-6 flex flex-col items-center min-h-screen bg-[#121212] text-white">
        <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 max-w-md w-full">
            <h1 class="text-[#EFB810] text-center mb-6">Editar Perfil</h1>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <!-- Nombre -->
                <div>
                    <label for="display_name" class="block mb-1 text-gray-300">Nombre</label>
                    <input type="text" id="display_name" v-model="formData.display_name"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none" />
                </div>

                <!-- Biografía -->
                <div>
                    <label for="bio" class="block mb-1 text-gray-300">Biografía</label>
                    <textarea id="bio" v-model="formData.bio"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none"
                        rows="3"></textarea>
                </div>

                <!-- Carrera -->
                <div>
                    <label for="career" class="block mb-1 text-gray-300">Carrera</label>
                    <input type="text" id="career" v-model="formData.career"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none" />
                </div>

                <button type="submit"
                    class="mt-4 px-4 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition flex justify-center">
                    <template v-if="!loading">Guardar cambios</template>
                    <template v-else>
                        <!-- <AppLoader /> -->
                         fdf
                    </template>
                </button>
            </form>

            <RouterLink to="/mi-perfil" class="block text-center mt-6 text-gray-400 hover:text-[#EFB810] transition">
                ← Volver al perfil
            </RouterLink>
        </div>
    </section>
</template>
