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
    <section class="p-6 mt-24 bg-[#121212] text-white min-h-screen">
        <h2 class="text-4xl font-bold mb-8 text-center text-[#EFB810] drop-shadow-md">🎵 Top 5 Soundtracks</h2>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div v-for="s in soundtracks" :key="s.id"
                class="bg-[#1C1C1C] border border-gray-700 rounded-lg p-6 text-center hover:scale-[1.02] transition shadow-md hover:shadow-lg">
                <h3 class="font-semibold text-[#EFB810] mb-3 text-lg">{{ s.titulo }}</h3>
                <audio controls class="w-full">
                    <source :src="s.url_audio" type="audio/mpeg" />
                    Tu navegador no soporta audio.
                </audio>
            </div>
        </div>
    </section>
</template>
