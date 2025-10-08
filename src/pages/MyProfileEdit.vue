<script>
import { subscribeToAuthStateChanges, updateAuthUser } from '../services/auth'
import { supabase } from '../services/supabase'

let unsubscribeFromAuth = () => { }

export default {
    name: 'MyProfileEdit',
    data() {
        return {
            formData: {
                username: '',
                description: '',
                avatar_url: '',
                favorite_genres: '',
                favorite_directors: '',
                location: '',
            },
            avatarFile: null,
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true

                // Subir avatar si hay uno nuevo
                if (this.avatarFile) {
                    const fileName = `${Date.now()}_${this.avatarFile.name}`
                    const { data, error } = await supabase.storage
                        .from('avatars')
                        .upload(fileName, this.avatarFile)
                    if (error) throw error

                    const { data: urlData } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(fileName)

                    this.formData.avatar_url = urlData.publicUrl
                }

                await updateAuthUser(this.formData)
                this.$router.push('/mi-perfil')
            } catch (error) {
                console.error('Error al actualizar perfil:', error.message)
            } finally {
                this.loading = false
            }
        },
        handleFileChange(event) {
            this.avatarFile = event.target.files[0]
        },
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuthStateChanges((newUserState) => {
            this.formData = {
                username: newUserState.username || '',
                description: newUserState.description || '',
                avatar_url: newUserState.avatar_url || '',
                favorite_genres: newUserState.favorite_genres || '',
                favorite_directors: newUserState.favorite_directors || '',
                location: newUserState.location || '',
            }
        })
    },
    unmounted() {
        unsubscribeFromAuth()
    },
}
</script>

<template>
    <section class="pt-24 px-6 flex flex-col items-center min-h-screen bg-[#121212] text-white">
        <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 max-w-md w-full">
            <h1 class="text-[#EFB810] text-center mb-6">Editar Perfil</h1>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <div class="flex flex-col items-center">
                    <img :src="formData.avatar_url || '/default-avatar.png'" alt="avatar"
                        class="w-24 h-24 rounded-full mb-2 border-2 border-[#EFB810]" />
                    <input type="file" @change="handleFileChange" accept="image/*" class="text-sm text-gray-400" />
                </div>

                <input v-model="formData.username" placeholder="Nombre de usuario"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <textarea v-model="formData.description" rows="3" placeholder="Descripción"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white"></textarea>

                <input v-model="formData.favorite_genres" placeholder="Géneros favoritos"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <input v-model="formData.favorite_directors" placeholder="Directores favoritos"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <input v-model="formData.location" placeholder="Ubicación"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <button type="submit"
                    class="mt-4 px-4 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition">
                    <template v-if="!loading">Guardar cambios</template>
                    <template v-else>Cargando...</template>
                </button>
            </form>

            <RouterLink to="/mi-perfil" class="block text-center mt-6 text-gray-400 hover:text-[#EFB810] transition">
                ← Volver al perfil
            </RouterLink>
        </div>
    </section>
</template>
