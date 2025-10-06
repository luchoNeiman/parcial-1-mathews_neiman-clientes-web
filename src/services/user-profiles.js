import { supabase } from './supabase'

/**
 * Obtiene el perfil de un usuario a partir de su ID.
 * 
 * @param {String} id 
 * @returns {Promise<{id: String, email: String, display_name: String|null, bio: String|null, career: String|null}>}
 */
export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        // eq() → WHERE id = {id}
        .eq('id', id)
        // limit() → limita la cantidad de registros
        .limit(1)
        // single() → retorna un objeto en vez de un array
        .single()

    if (error) {
        console.error('[user-profiles.js getUserProfileById] Error al traer el perfil del usuario', id, error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Crea un nuevo perfil de usuario en la tabla `user_profiles`.
 * 
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null, career?: String|null}} data 
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

/**
 * Actualiza los datos del perfil de un usuario.
 * 
 * @param {String} id 
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data 
 */
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
