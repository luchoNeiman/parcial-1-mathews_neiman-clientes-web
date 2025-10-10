<script>
import { supabase } from '../services/supabase'
import { subscribeToAuthStateChanges } from '../services/auth'

export default {
    name: 'EditMyMovie',
    data() {
        return {
            movie: null,
            user: { id: null, email: null },
            form: {
                titulo: '',
                description: '',
                posterFile: null,
            },
            loading: false,
            errorMessage: '',
            successMessage: '',
            showDeleteModal: false,
        }
    },

    methods: {
        handleFileChange(e) {
            this.form.posterFile = e.target.files[0]
        },

        async fetchMovie() {
            const movieId = this.$route.params.id
            const { data, error } = await supabase
                .from('movies')
                .select('*')
                .eq('id', movieId)
                .single()

            if (error) {
                this.errorMessage = 'Error al cargar la película.'
                return
            }

            this.movie = data
            this.form.titulo = data.titulo
            this.form.description = data.description
        },

        async handleSubmit() {
            try {
                this.loading = true
                this.errorMessage = ''
                this.successMessage = ''

                if (!this.user.id) {
                    this.errorMessage = 'Tenés que iniciar sesión para editar la película.'
                    return
                }

                if (this.movie.user_id !== this.user.id) {
                    this.errorMessage = 'No tenés permiso para editar esta película.'
                    return
                }

                let posterUrl = this.movie.poster

                // Si el usuario sube un nuevo póster
                if (this.form.posterFile) {
                    const file = this.form.posterFile
                    const fileName = `${this.user.id}-${Date.now()}-${file.name}`

                    const { error: uploadError } = await supabase.storage
                        .from('posters')
                        .upload(fileName, file, { upsert: true })

                    if (uploadError) throw uploadError

                    const { data: urlData } = supabase.storage
                        .from('posters')
                        .getPublicUrl(fileName)

                    posterUrl = urlData.publicUrl
                }

                // Actualizar película
                const { error: updateError } = await supabase
                    .from('movies')
                    .update({
                        titulo: this.form.titulo.trim(),
                        description: this.form.description.trim(),
                        poster: posterUrl,
                    })
                    .eq('id', this.movie.id)
                    .eq('user_id', this.user.id) // refuerzo de seguridad

                if (updateError) throw updateError

                this.successMessage = 'Película actualizada con éxito'
                setTimeout(() => this.$router.push(`/movies/${this.movie.id}`), 1500)
            } catch (err) {
                this.errorMessage = 'No se pudo actualizar la película. Verificá tus permisos.'
            } finally {
                this.loading = false
            }
        },

        async confirmDelete() {
            this.showDeleteModal = true
        },

        async deleteMovie() {
            try {
                this.loading = true
                this.errorMessage = ''
                this.successMessage = ''

                const { error } = await supabase
                    .from('movies')
                    .delete()
                    .eq('id', this.movie.id)
                    .eq('user_id', this.user.id)

                if (error) throw error

                this.successMessage = 'Película eliminada correctamente'
                this.showDeleteModal = false
                setTimeout(() => this.$router.push('/mi-perfil'), 1500)
            } catch (err) {
                this.errorMessage = 'No se pudo eliminar la película. Verificá tus permisos.'
            } finally {
                this.loading = false
            }
        },
    },

    async mounted() {
        subscribeToAuthStateChanges(async (newUser) => {
            this.user = newUser
            await this.fetchMovie()

            if (this.movie && this.movie.user_id !== this.user.id) {
                this.errorMessage = 'No tenés permiso para editar esta película.'
                setTimeout(() => this.$router.push('/movies'), 2000)
            }
        })
    },
}
</script>

<template>
    <section class="pt-24 px-6 min-h-screen bg-[#121212] text-white flex flex-col items-center">
        <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl p-8 w-full max-w-2xl flex flex-col gap-6">
            <h1 class="text-3xl font-bold text-center text-[#EFB810]">Editar película</h1>

            <div v-if="!movie && !errorMessage" class="text-center text-gray-400 py-6">
                Cargando información...
            </div>

            <div v-if="errorMessage" class="text-red-500 text-center">
                {{ errorMessage }}
            </div>

            <form v-if="movie" @submit.prevent="handleSubmit" class="flex flex-col gap-5">
                <!-- Título -->
                <div>
                    <label for="titulo" class="block mb-1 text-gray-300">Título</label>
                    <input type="text" id="titulo" v-model="form.titulo"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none" />
                </div>

                <!-- Descripción -->
                <div>
                    <label for="description" class="block mb-1 text-gray-300">Descripción</label>
                    <textarea id="description" v-model="form.description" rows="4"
                        class="w-full p-2 rounded bg-[#2A2A2A] border border-gray-600 text-white focus:border-[#EFB810] focus:outline-none"></textarea>
                </div>

                <!-- Poster -->
                <div class="flex flex-col items-center gap-3">
                    <label for="poster" class="block mb-1 text-gray-300">Póster actual</label>
                    <img :src="movie.poster" alt="Póster actual" loading="lazy"
                        class="w-48 h-64 object-cover border-2 border-[#EFB810] rounded" />
                    <input type="file" id="poster" accept="image/*" @change="handleFileChange"
                        class="w-full text-sm text-gray-300 border border-gray-600 rounded bg-[#2A2A2A] p-2 cursor-pointer" />
                </div>

                <div v-if="successMessage" class="text-green-500 text-center">
                    {{ successMessage }}
                </div>

                <div class="flex justify-between items-center mt-6">
                    <button type="submit" :disabled="loading"
                        class="px-6 py-2 rounded bg-[#EFB810] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50">
                        {{ loading ? 'Guardando...' : 'Guardar cambios' }}
                    </button>

                    <button type="button" @click="confirmDelete"
                        class="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                        Eliminar
                    </button>
                </div>
            </form>
        </div>

        <!-- Modal de confirmación -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div class="bg-[#1C1C1C] border border-gray-700 rounded-xl p-6 w-80 text-center shadow-2xl">
                <h2 class="text-xl font-semibold text-[#EFB810] mb-4">¿Eliminar esta película?</h2>
                <p class="text-gray-300 mb-6">Esta acción no se puede deshacer.</p>

                <div class="flex justify-center gap-4">
                    <button @click="deleteMovie"
                        class="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition">
                        Sí, eliminar
                    </button>
                    <button @click="showDeleteModal = false"
                        class="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-500 transition">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
