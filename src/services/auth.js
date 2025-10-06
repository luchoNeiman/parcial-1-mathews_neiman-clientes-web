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

// Lista de observadores (componentes suscriptos)
let observers = []

// Apenas se carga este módulo, chequeamos si hay un usuario logueado
loadCurrentUserAuthState()

/**
 * Carga el estado actual de autenticación al iniciar la app.
 */
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

    // En paralelo, traemos su perfil completo
    fetchFullProfile()
}

/**
 * Trae los datos del perfil completo del usuario actual desde la tabla profiles.
 */
async function fetchFullProfile() {
    try {
        const profile = await getUserProfileById(user.id)
        setUser(profile)
    } catch (error) {
        console.error('[auth.js] Error al cargar perfil completo:', error.message)
    }
}

/*------------------------------------------------------------------------------
| AUTH METHODS
+------------------------------------------------------------------------------*/

/**
 * Registra un nuevo usuario en Supabase Auth.
 * @param {string} email
 * @param {string} password
 */
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

/**
 * Inicia sesión con email y contraseña.
 * @param {string} email
 * @param {string} password
 */
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

/**
 * Cierra sesión del usuario actual.
 */
export async function logout() {
    await supabase.auth.signOut()

    setUser({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
    })
}

/**
 * Actualiza el perfil del usuario actual (display_name, bio, career).
 * @param {{display_name?: string|null, bio?: string|null, career?: string|null}} data
 */
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

/**
 * Permite a un componente suscribirse a los cambios del estado del usuario.
 * Retorna una función para cancelar la suscripción.
 * @param {(userState: typeof user) => void} callback
 */
export function subscribeToAuthStateChanges(callback) {
    observers.push(callback)
    notify(callback)

    // Retornar función para “desuscribirse”
    return () => {
        observers = observers.filter((obs) => obs !== callback)
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
