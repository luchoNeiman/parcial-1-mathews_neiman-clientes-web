<script>
import { supabase } from '../services/supabase'
import { subscribeToAuthStateChanges } from '../services/auth'

export default {
    name: 'CreateMoviePost',
    data() {
        return {
            user: { id: null, username: null },
            form: { titulo: '', description: '', posterFile: null },
            posterPreview: '',
            loading: false,
            notification: {
                show: false,
                type: '',
                message: '',
                title: ''
            },
        }
    },

    methods: {
        showNotification(type, title, message) {
            this.notification = {
                show: true,
                type,
                title,
                message
            }
            // Auto ocultar después de 5 segundos
            setTimeout(() => {
                this.notification.show = false
            }, 5000)
        },

        closeNotification() {
            this.notification.show = false
        },

        handleFileChange(event) {
            const file = event.target.files[0]
            if (file) {
                this.form.posterFile = file
                this.posterPreview = URL.createObjectURL(file)
            }
        },

        async handleSubmit() {
            this.notification.show = false

            if (!this.form.titulo.trim() || !this.form.description.trim()) {
                this.showNotification('error', 'Campos incompletos', 'Completá todos los campos para continuar.')
                return
            }

            if (!this.user.id) {
                this.showNotification('error', 'Sesión requerida', 'Tenés que iniciar sesión para publicar una película.')
                return
            }

            if (!this.form.posterFile) {
                this.showNotification('error', 'Imagen requerida', 'Subí una imagen para el póster de la película.')
                return
            }

            try {
                this.loading = true
                const file = this.form.posterFile
                const fileExt = file.name.split('.').pop()
                const fileName = `${this.user.id}-${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('posters')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false })

                if (uploadError) throw uploadError

                const { data: publicUrlData } = supabase.storage.from('posters').getPublicUrl(fileName)
                const publicUrl = publicUrlData.publicUrl

                const { error: dbError } = await supabase.from('movies').insert([
                    {
                        user_id: this.user.id,
                        titulo: this.form.titulo.trim(),
                        description: this.form.description.trim(),
                        poster: publicUrl,
                    },
                ])

                if (dbError) throw dbError

                this.showNotification('success', '¡Película publicada!', `"${this.form.titulo}" se agregó exitosamente a tu perfil.`)
                this.form = { titulo: '', description: '', posterFile: null }
                this.posterPreview = ''

                setTimeout(() => {
                    this.$router.push('/movies')
                }, 2000)
            } catch (error) {
                this.showNotification('error', 'Error al publicar', 'No se pudo subir la película. Revisá tu conexión e intentá de nuevo.')
            } finally {
                this.loading = false
            }
        },
    },

    mounted() {
        subscribeToAuthStateChanges((newUserState) => {
            this.user = newUserState
        })
    },
}
</script>

<template>
    <section class="pt-24 px-6 min-h-screen bg-[#121212] text-white flex flex-col items-center relative">
        <div v-if="notification.show"
            :class="[
                'fixed top-24 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out',
                notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            ]">
            <div :class="[
                'rounded-lg shadow-lg border-l-4 p-4',
                notification.type === 'success'
                    ? 'bg-green-900 border-green-500 text-green-100'
                    : 'bg-red-900 border-red-500 text-red-100'
            ]">
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-3">
                        <svg v-if="notification.type === 'success'" class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <svg v-else class="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold mb-1">{{ notification.title }}</h4>
                        <p class="text-sm">{{ notification.message }}</p>
                    </div>
                    <button @click="closeNotification"
                        class="ml-3 text-gray-400 hover:text-white transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 w-full max-w-2xl flex flex-col gap-6">
            <div class="text-center">
                <div class="flex items-center justify-center gap-3 mb-2">
                    <svg class="w-8 h-8 text-[#EFB810]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                    <h1 class="text-3xl font-bold text-[#EFB810] leading-none">Crear publicación</h1>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <input v-model="form.titulo" placeholder="Título de la película"
                    class="p-3 rounded-lg bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none transition" required />

                <textarea v-model="form.description" rows="4" placeholder="Descripción o reseña"
                    class="p-3 rounded-lg bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none transition resize-none" required></textarea>

                <label
                    class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#EFB810]/60 rounded-xl cursor-pointer hover:bg-[#2A2A2A] hover:border-[#EFB810] transition group">
                    <div class="flex flex-col items-center text-center">
                        <svg class="w-12 h-12 mb-3 mx-auto text-gray-400 group-hover:text-[#EFB810] group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span class="text-gray-400 group-hover:text-[#EFB810] transition">
                            {{ posterPreview ? 'Cambiar póster' : 'Subir póster de la película' }}
                        </span>
                        <p class="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
                    </div>
                    <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                    <img v-if="posterPreview" :src="posterPreview" alt="poster preview" loading="lazy"
                        class="w-48 h-72 object-cover rounded-lg border-2 border-[#EFB810] mt-4 shadow-lg" />
                </label>

                <button type="submit" :disabled="loading"
                    class="px-6 py-3 rounded-lg bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></span>
                    {{ loading ? 'Publicando...' : 'Publicar película' }}
                </button>
            </form>
        </div>
    </section>
</template>
