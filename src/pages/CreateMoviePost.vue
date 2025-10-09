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
            successMessage: '',
            errorMessage: '',
        }
    },

    methods: {
        handleFileChange(event) {
            const file = event.target.files[0]
            if (file) {
                this.form.posterFile = file
                this.posterPreview = URL.createObjectURL(file)
            }
        },

        async handleSubmit() {
            this.errorMessage = ''
            this.successMessage = ''

            if (!this.form.titulo.trim() || !this.form.description.trim()) {
                this.errorMessage = 'Completá todos los campos.'
                return
            }

            if (!this.user.id) {
                this.errorMessage = 'Tenés que iniciar sesión para publicar.'
                return
            }

            if (!this.form.posterFile) {
                this.errorMessage = 'Subí una imagen para el póster.'
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

                this.successMessage = 'Publicación creada con éxito 🎥'
                this.form = { titulo: '', description: '', posterFile: null }
                this.posterPreview = ''
            } catch (error) {
                console.error('[CreateMoviePost.vue] Error:', error.message)
                this.errorMessage = 'Error al subir la película. Revisá tus permisos o conexión.'
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
    <section class="pt-24 px-6 min-h-screen bg-[#121212] text-white flex flex-col items-center">
        <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 w-full max-w-2xl flex flex-col gap-6">
            <h1 class="text-3xl font-bold text-center text-[#EFB810]">🎬 Crear publicación</h1>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <input v-model="form.titulo" placeholder="Título de la película"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" required />

                <textarea v-model="form.description" rows="4" placeholder="Descripción o reseña"
                    class="p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white" required></textarea>

                <!-- File upload -->
                <label
                    class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#EFB810]/60 rounded-xl cursor-pointer hover:bg-[#2A2A2A] transition">
                    <span class="text-gray-400 mb-2">📁 Subir póster</span>
                    <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                    <img v-if="posterPreview" :src="posterPreview" alt="poster preview"
                        class="w-64 h-64 object-cover rounded-xl border border-[#EFB810] mt-2" />
                </label>

                <div v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</div>
                <div v-if="successMessage" class="text-green-500 text-sm text-center">{{ successMessage }}</div>

                <button type="submit" :disabled="loading"
                    class="px-6 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50">
                    {{ loading ? 'Publicando...' : 'Publicar' }}
                </button>
            </form>
        </div>
    </section>
</template>
