import { supabase } from './supabase'
import { createUserProfile, getUserProfileById, updateUserProfile } from './user-profiles'

function toInitialsSeed(value = '') {
    const localPart = value.split('@')[0] || 'Usuario'
    return localPart
        .replace(/[._-]+/g, ' ')
        .trim()
}

function buildInitialsAvatarUrl(value = '') {
    const name = toInitialsSeed(value) || 'Usuario'
    const params = new URLSearchParams({
        name,
        background: 'EFB810',
        color: '121212',
        bold: 'true',
        size: '256',
        format: 'png',
    })
    return `https://ui-avatars.com/api/?${params.toString()}`
}

// Estado local del usuario (inicialmente vacío)
let user = {
    id: null,
    email: null,
    username: null,
    bio: null,
    avatar_url: null,
    favorite_genres: null,
    favorite_directors: null,
    location: null,
    verified: false,
}

let observers = []

// Apenas se carga este módulo, chequeamos si hay un usuario logueado
loadCurrentUserAuthState()

async function loadCurrentUserAuthState() {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
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
        const fullProfile = await getUserProfileById(user.id)

        if (!fullProfile.avatar_url) {
            const defaultAvatarUrl = buildInitialsAvatarUrl(
                fullProfile.username || fullProfile.email || user.email || 'Usuario'
            )

            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ avatar_url: defaultAvatarUrl })
                .eq('id', fullProfile.id)

            if (!updateError) {
                fullProfile.avatar_url = defaultAvatarUrl
            }
        }

        setUser(fullProfile)
    } catch (error) {
        console.error('[auth.js] Error al cargar perfil completo:', error.message)
    }
}


export async function register(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
            throw new Error(error.message)
        }

        const defaultAvatarUrl = buildInitialsAvatarUrl(data.user.email)

        // Crear perfil en user_profiles con los campos por defecto
        await createUserProfile({
            id: data.user.id,
            email: data.user.email,
            username: email.split('@')[0], // genera un username inicial básico
            bio: '',
            avatar_url: defaultAvatarUrl,
            favorite_genres: '',
            favorite_directors: '',
            location: '',
            verified: false,
        })

        setUser({
            id: data.user.id,
            email: data.user.email,
            username: email.split('@')[0],
            avatar_url: defaultAvatarUrl,
        })
    } catch (error) {
        throw error
    }
}

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
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
        username: null,
        bio: null,
        avatar_url: null,
        favorite_genres: null,
        favorite_directors: null,
        location: null,
        verified: false,
    })
}

export async function updateAuthUser(data) {
    try {
        await updateUserProfile(user.id, data)
        setUser(data)
    } catch (error) {
        throw error
    }
}


export function subscribeToAuthStateChanges(callback) {
    observers.push(callback)
    notify(callback)

    // Retornar función para “desuscribirse”
    return () => {
        observers = observers.filter(obs => callback != obs)
    }
}

function notify(callback) {
    callback({ ...user }) // se pasa una copia
}

function notifyAll() {
    observers.forEach(notify)
}

function setUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll()
}
