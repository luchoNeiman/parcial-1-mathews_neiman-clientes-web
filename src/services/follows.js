import { supabase } from './supabase'

export async function followUser(followingId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
        .from('follows')
        .insert({
            follower_id: user.id,
            following_id: followingId
        })

    if (error) throw error
    return data
}

export async function unfollowUser(followingId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId)

    if (error) throw error
}

export async function isFollowing(followingId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .maybeSingle()

    if (error) throw error
    return !!data
}

export async function getFollowersCount(userId) {
    const { count, error } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId)

    if (error) throw error
    return count || 0
}

export async function getFollowingCount(userId) {
    const { count, error } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId)

    if (error) throw error
    return count || 0
}

// Nueva función optimizada que obtiene ambos conteos en una sola operación
export async function getFollowStats(userId) {
    try {
        const [followersResult, followingResult] = await Promise.all([
            supabase
                .from('follows')
                .select('id', { count: 'exact', head: true })
                .eq('following_id', userId),
            supabase
                .from('follows')
                .select('id', { count: 'exact', head: true })
                .eq('follower_id', userId)
        ])

        return {
            followersCount: followersResult.count || 0,
            followingCount: followingResult.count || 0
        }
    } catch (error) {
        return { followersCount: 0, followingCount: 0 }
    }
}

export async function getFollowers(userId, limit = 10) {
    const { data, error } = await supabase
        .from('follows')
        .select(`
            follower_id,
            user_profiles!follows_follower_id_fkey(id, username, avatar_url)
        `)
        .eq('following_id', userId)
        .limit(limit)

    if (error) throw error
    return data || []
}

export async function getFollowing(userId, limit = 10) {
    const { data, error } = await supabase
        .from('follows')
        .select(`
            following_id,
            user_profiles!follows_following_id_fkey(id, username, avatar_url)
        `)
        .eq('follower_id', userId)
        .limit(limit)

    if (error) throw error
    return data || []
}