import { supabase } from './supabase.js'


export async function getMessages() {
    // Obtener todos los mensajes
    const { data, error } = await supabase
        .from('chat')
        .select('*')
        .order('created_at', { ascending: true })
    if (error) {
        console.error('[global-chat.js getMessages] Error al traer los mensajes iniciales del chat.', error);
        throw new Error(error.message);
    } return data || []
}

export async function sendMessage(user, text) {
    // Enviar mensaje nuevo
    const { error } = await supabase
        .from('chat')
        .insert({ user, text })
    if (error) {
        console.error('[global-chat.js sendMessage] Error al enviar el nuevo mensaje.', error);
        throw new Error(error.message);
    }
}

export async function subscribeToMessages(callback) {
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
}

