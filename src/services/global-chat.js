import { supabase } from './supabase.js'


export async function getMessages() {
    // Obtener todos los mensajes
    const { data, error } = await supabase
        .from('global_chat_messages')
        .select()
        .order('created_at', { ascending: true })
    if (error) {
        console.error('[global-chat.js getMessages] Error al traer los mensajes iniciales del chat.', error);
        throw new Error(error.message);
    } return data || []
}

export async function sendMessage(sender_id, email, content) {
    // Enviar mensaje nuevo
    const { error } = await supabase
        .from('global_chat_messages')
        .insert({sender_id, email, content })
    if (error) {
        console.error('[global-chat.js sendMessage] Error al enviar el nuevo mensaje.', error);
        throw new Error(error.message);
    }
}

export function subscribeToMessages(callback) {
    // Escuchar mensajes en tiempo real
    const channel = supabase
        .channel('global_chat_messages')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'global_chat_messages' },
            payload => {
                callback(payload.new)
            }
        )
        .subscribe()

    return () => {
        channel.unsubscribe();
    }
}

