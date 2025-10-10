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
                bio: '',
                avatar_url: '',
                favorite_genres: '',
                favorite_directors: '',
                location: '',
            },
            avatarFile: null,
            avatarPreview: '',
            loading: false,
        }
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0]
            if (file) {
                this.avatarFile = file
                this.avatarPreview = URL.createObjectURL(file)
            }
        },

        async handleSubmit() {
            try {
                this.loading = true

                // Subir nuevo avatar si corresponde
                if (this.avatarFile) {
                    const fileName = `${this.formData.username || 'user'}_${Date.now()}_${this.avatarFile.name}`
                    const { error: uploadError } = await supabase.storage
                        .from('avatars')
                        .upload(fileName, this.avatarFile, { cacheControl: '3600', upsert: false })

                    if (uploadError) throw uploadError

                    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
                    this.formData.avatar_url = urlData.publicUrl
                }

                await updateAuthUser(this.formData)
                this.$router.push('/mi-perfil')
            } catch (error) {
                alert('Error al guardar cambios. Verificá tu conexión o permisos.')
            } finally {
                this.loading = false
            }
        },
    },

    mounted() {
        unsubscribeFromAuth = subscribeToAuthStateChanges((newUserState) => {
            this.formData = {
                username: newUserState.username || '',
                bio: newUserState.bio || '',
                avatar_url: newUserState.avatar_url || '',
                favorite_genres: newUserState.favorite_genres || '',
                favorite_directors: newUserState.favorite_directors || '',
                location: newUserState.location || '',
            }
            this.avatarPreview = this.formData.avatar_url
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
            <h1 class="text-[#EFB810] text-center mb-6 text-2xl font-bold flex items-center justify-center gap-2">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                </svg>
                Editar Perfil
            </h1>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <div class="flex flex-col items-center relative">
                    <div
                        class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#EFB810] cursor-pointer group">
                        <img :src="avatarPreview || '/default-avatar.png'" alt="avatar preview" loading="lazy"
                            class="object-cover w-full h-full group-hover:opacity-70 transition" />
                        <input type="file" accept="image/*" @change="handleFileChange"
                            class="absolute inset-0 opacity-0 cursor-pointer" />
                        <div
                            class="absolute bottom-0 w-full bg-black/50 text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition">
                            Cambiar foto
                        </div>
                    </div>
                </div>

                <input v-model="formData.username" placeholder="Nombre de usuario"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <textarea v-model="formData.bio" rows="3" placeholder="Descripción"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white"></textarea>

                <input v-model="formData.favorite_genres" placeholder="Géneros favoritos"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <input v-model="formData.favorite_directors" placeholder="Directores favoritos"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <input v-model="formData.location" placeholder="Ubicación"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" />

                <button type="submit"
                    class="mt-4 px-4 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition">
                    {{ loading ? 'Guardando...' : 'Guardar cambios' }}
                </button>
            </form>

            <RouterLink to="/mi-perfil" class="block text-center mt-6 text-gray-400 hover:text-[#EFB810] transition">
                ← Volver al perfil
            </RouterLink>
        </div>
    </section>
</template>
