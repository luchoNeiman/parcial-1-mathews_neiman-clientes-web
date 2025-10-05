// src/services/global-chat.js
import { supabase } from './supabase.js'

export default {
    async getMessages() {
        // Obtener todos los mensajes
        const { data, error } = await supabase
            .from('chat')
            .select('*')
            .order('created_at', { ascending: true })
        if (error) console.error('Error al obtener mensajes:', error.message)
        return data || []
    },

    async sendMessage(user, text) {
        // Enviar mensaje nuevo
        const { error } = await supabase
            .from('chat')
            .insert({ user, text })
        if (error) console.error('Error al enviar mensaje:', error.message)
    },

    subscribeToMessages(callback) {
        // Escuchar mensajes en tiempo real
        const channel = supabase
            .channel('chat-room')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat' },
                payload => {
                    callback(payload.new)
                }
            )
            .subscribe()

        return channel
    },
}
