import { supabase } from './supabase'

/**
 * Obtiene el perfil completo de un usuario por su ID.
 */
export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select(`
      id,
      email,
      username,
      bio,
      avatar_url,
      favorite_genres,
      favorite_directors,
      location,
      verified,
      created_at,
      last_active_at
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('[user-profiles.js getUserProfileById] Error al traer el perfil del usuario:', id, error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Crea un nuevo perfil de usuario en la tabla `user_profiles`.
 */
export async function createUserProfile(data) {
    const {
        id,
        email,
        username = null,
        bio = null,
        avatar_url = null,
        favorite_genres = null,
        favorite_directors = null,
        location = null,
        verified = false,
        last_active_at = null,
    } = data

    const { error } = await supabase.from('user_profiles').insert([
        {
            id,
            email,
            username,
            bio,
            avatar_url,
            favorite_genres,
            favorite_directors,
            location,
            verified,
            last_active_at,
        },
    ])

    if (error) {
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario:', id, error)
        throw new Error(error.message)
    }
}

/**
 * Actualiza un perfil existente.
 */
export async function updateUserProfile(id, data) {
    const {
        username,
        bio,
        avatar_url,
        favorite_genres,
        favorite_directors,
        location,
        verified,
        last_active_at,
    } = data

    const { error } = await supabase
        .from('user_profiles')
        .update({
            username,
            bio,
            avatar_url,
            favorite_genres,
            favorite_directors,
            location,
            verified,
            last_active_at,
        })
        .eq('id', id)

    if (error) {
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario:', id, error)
        throw new Error(error.message)
    }
}
