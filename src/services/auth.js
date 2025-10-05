// src/services/auth.js
import { supabase } from './supabase.js'

export default {
    async signUp(email, password) {
        // Registrar nuevo usuario
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) console.error('Error en signUp:', error.message)
        return { data, error }
    },

    async signIn(email, password) {
        // Iniciar sesión
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) console.error('Error en signIn:', error.message)
        return { data, error }
    },

    async signOut() {
        // Cerrar sesión
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Error en signOut:', error.message)
    },

    async getSession() {
        // Obtener sesión actual
        const { data } = await supabase.auth.getSession()
        return data.session
    },
}
