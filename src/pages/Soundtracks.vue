<script>
import { supabase } from '../services/supabase.js'

export default {
    name: 'Soundtracks',
    data() {
        return {
            soundtracks: [],
        }
    },
    async created() {
        const { data, error } = await supabase.from('soundtracks').select('*')
        if (error) console.error('Error al cargar soundtracks:', error.message)
        this.soundtracks = data || []
    },
}
</script>


<template>
    <section class="p-6 mt-20">
        <h2 class="text-3xl font-bold mb-6 text-center">Top 5 Soundtracks</h2>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="s in soundtracks" :key="s.id"
                class="border border-gray-700 p-4 rounded flex flex-col items-center">
                <h3 class="font-semibold mb-2">{{ s.titulo }}</h3>
                <audio controls class="w-full">
                    <source :src="s.url_audio" type="audio/mpeg" />
                    Tu navegador no soporta audio.
                </audio>
            </div>
        </div>
    </section>
</template>
