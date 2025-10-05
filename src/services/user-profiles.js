// src/services/user-profiles.js
import { supabase } from './supabase.js'

export default {
    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        if (error) console.error('Error al obtener perfil:', error.message)
        return data
    },

    async updateUserProfile(userId, fields) {
        const { error } = await supabase
            .from('profiles')
            .update(fields)
            .eq('id', userId)
        if (error) console.error('Error al actualizar perfil:', error.message)
    },

    async createUserProfile(userId, username) {
        const { error } = await supabase
            .from('profiles')
            .insert({ id: userId, username })
        if (error) console.error('Error al crear perfil:', error.message)
    },
}
