import { supabase } from './supabase.js'

/**
 * Obtener todos los mensajes del chat global.
 * Retorna los mensajes en orden cronológico ascendente.
 */
export async function getMessages() {
    try {
        const { data, error } = await supabase
            .from('chat')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) throw error

        return data || []
    } catch (err) {
        console.error('[global-chat.js:getMessages] Error al obtener mensajes:', err.message)
        throw new Error('No se pudieron obtener los mensajes del chat.')
    }
}

/**
 * Enviar un mensaje nuevo al chat global.
 * Ahora guarda username y avatar_url además de email.
 */
export async function sendMessage(sender_id, username, email, content, avatar_url = null) {
    try {
        if (!sender_id || !content.trim()) {
            throw new Error('El mensaje no puede estar vacío.')
        }

        const { error } = await supabase
            .from('chat')
            .insert({
                sender_id,
                username,
                email,
                content: content.trim(),
                avatar_url,
            })

        if (error) throw error
    } catch (err) {
        console.error('[global-chat.js:sendMessage] Error al enviar mensaje:', err.message)
        throw new Error('No se pudo enviar el mensaje.')
    }
}

/*
 * Suscribirse en tiempo real a nuevos mensajes del chat global.
 * Llama al callback cada vez que se inserta un nuevo mensaje.
 */
export function subscribeToMessages(callback) {
    try {
        const channel = supabase
            .channel('chat')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat' },
                (payload) => {
                    if (payload?.new) callback(payload.new)
                }
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    } catch (err) {
        console.error('[global-chat.js:subscribeToMessages] Error al suscribirse:', err.message)
        return () => { }
    }
}
