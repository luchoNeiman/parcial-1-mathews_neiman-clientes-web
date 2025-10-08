<script>
import { supabase } from '../services/supabase'
import { subscribeToAuthStateChanges } from '../services/auth'

export default {
    name: 'CreateMoviePost',
    data() {
        return {
            user: {
                id: null,
                email: null,
                username: null,
            },
            form: {
                titulo: '',
                description: '', 
                posterFile: null,
            },
            loading: false,
            successMessage: '',
            errorMessage: '',
        }
    },

    methods: {
        handleFileChange(event) {
            this.form.posterFile = event.target.files[0]
        },

        async handleSubmit() {
            this.successMessage = ''
            this.errorMessage = ''

            // Validaciones
            if (!this.form.titulo.trim() || !this.form.description.trim()) {
                this.errorMessage = 'Todos los campos son obligatorios.'
                return
            }

            if (!this.user.id) {
                this.errorMessage = 'Tenés que iniciar sesión para publicar.'
                return
            }

            if (!this.form.posterFile) {
                this.errorMessage = 'Tenés que subir una imagen del póster.'
                return
            }

            try {
                this.loading = true

                // 🟡 Subir archivo al bucket "posters"
                const file = this.form.posterFile
                const fileExt = file.name.split('.').pop()
                const fileName = `${this.user.id}-${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('posters')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false,
                    })

                if (uploadError) throw uploadError

                // 🟢 Obtener la URL pública del archivo subido
                const { data: publicUrlData } = supabase
                    .storage
                    .from('posters')
                    .getPublicUrl(fileName)

                const publicUrl = publicUrlData.publicUrl

                // 🔵 Insertar la película en la base de datos
                const { error: dbError } = await supabase
                    .from('movies')
                    .insert([
                        {
                            user_id: this.user.id,
                            titulo: this.form.titulo.trim(),
                            description: this.form.description.trim(),
                            poster: publicUrl,
                        },
                    ])

                if (dbError) throw dbError

                // ✅ Reset y mensaje de éxito
                this.successMessage = 'Película publicada con éxito 🎬'
                this.form = { titulo: '', description: '', posterFile: null }
                this.$refs.fileInput.value = ''
            } catch (error) {
                console.error('[CreateMoviePost.vue] Error al crear publicación:', error.message)
                this.errorMessage = 'Ocurrió un error al subir la película. Verificá tu conexión o permisos.'
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
            <h1 class="text-3xl font-bold text-center text-[#EFB810]">🎬 Crear nueva publicación</h1>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <!-- TÍTULO -->
                <div>
                    <label for="titulo" class="block mb-1 text-gray-300">Título de la película</label>
                    <input type="text" id="titulo" v-model="form.titulo"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none"
                        placeholder="Ej: El Club de la Pelea" required />
                </div>

                <!-- DESCRIPCIÓN -->
                <div>
                    <label for="descripcion" class="block mb-1 text-gray-300">Descripción</label>
                    <textarea id="descripcion" v-model="form.description" rows="4"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none"
                        placeholder="Contanos de qué trata esta película o por qué te gusta..." required></textarea>
                </div>

                <!-- ARCHIVO DE PÓSTER -->
                <div>
                    <label for="poster" class="block mb-1 text-gray-300">Subir póster</label>
                    <input type="file" id="poster" accept="image/*" ref="fileInput" @change="handleFileChange"
                        class="w-full text-sm text-gray-300 border border-gray-600 rounded bg-[#2A2A2A] p-2 cursor-pointer" />
                </div>

                <!-- MENSAJES -->
                <div v-if="errorMessage" class="text-red-500 text-sm">
                    {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="text-green-500 text-sm">
                    {{ successMessage }}
                </div>

                <!-- BOTÓN -->
                <button type="submit" :disabled="loading"
                    class="px-6 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50">
                    {{ loading ? 'Publicando...' : 'Publicar película' }}
                </button>
            </form>
        </div>
    </section>
</template>
