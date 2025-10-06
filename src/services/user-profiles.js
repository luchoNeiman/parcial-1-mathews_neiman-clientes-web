import { supabase } from './supabase'


export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id)
        .limit(1)
        .single()

    if (error) {
        console.error('[user-profiles.js getUserProfileById] Error al traer el perfil del usuario', id, error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Crea un nuevo perfil de usuario en la tabla `user_profiles`.
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data)

    if (error) {
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario', data?.id, error)
        throw new Error(error.message)
    }
}


export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario', id, error)
        throw new Error(error.message)
    }
}
