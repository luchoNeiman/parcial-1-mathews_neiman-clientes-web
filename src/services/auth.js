import { supabase } from './supabase'
import { createUserProfile, getUserProfileById, updateUserProfile } from './user-profiles'

// Estado local del usuario (inicialmente vacío)
let user = {
    id: null,
    email: null,
    display_name: null,
    bio: null,
    career: null,
}

let observers = []

// Apenas se carga este módulo, chequeamos si hay un usuario logueado
loadCurrentUserAuthState()


async function loadCurrentUserAuthState() {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
        console.warn('[auth.js] No hay usuario autenticado.')
        return
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    })

    fetchFullProfile()
}


async function fetchFullProfile() {
    try {
        setUser(await getUserProfileById(user.id))
    } catch (error) {
        console.error('[auth.js] Error al cargar perfil completo:', error.message)
    }
}

/*------------------------------------------------------------------------------
| AUTH METHODS
+------------------------------------------------------------------------------*/


export async function register(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
            console.error('[auth.js register] Error al registrar usuario.', error)
            throw new Error(error.message)
        }

        // Crear perfil en la tabla profiles
        await createUserProfile({
            id: data.user.id,
            email: data.user.email,
        })

        setUser({
            id: data.user.id,
            email: data.user.email,
        })
    } catch (error) {
        console.error('[auth.js register] Error inesperado:', error.message)
    }
}


export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('[auth.js login] Error al iniciar sesión.', error)
        throw new Error(error.message)
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    })

    fetchFullProfile()
}


export async function logout() {
    await supabase.auth.signOut()

    setUser({
        id: null,
        email: null,
    })
}


export async function updateAuthUser(data) {
    try {
        await updateUserProfile(user.id, data)
        setUser(data)
    } catch (error) {
        console.error('[auth.js updateAuthUser] Error al actualizar perfil:', error)
    }
}

/*------------------------------------------------------------------------------
| OBSERVER PATTERN
+------------------------------------------------------------------------------*/


export function subscribeToAuthStateChanges(callback) {
    observers.push(callback)
    notify(callback)

    // Retornar función para “desuscribirse”
    return () => {
        observers = observers.filter(obs => callback != obs)
    }
}

/**
 * Notifica un único observer con el estado actual.
 */
function notify(callback) {
    callback({ ...user }) // se pasa una copia
}

/**
 * Notifica a todos los observers suscriptos.
 */
function notifyAll() {
    observers.forEach(notify)
}

/**
 * Actualiza el estado local del usuario y notifica a los observers.
 */
function setUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll()
}
