import { supabase } from './supabase'

const VISITS_SESSION_KEY = 'underground_visit_recorded'

export async function recordVisit() {
    try {
        if (sessionStorage.getItem(VISITS_SESSION_KEY)) return

        const { error } = await supabase
            .from('site_visits')
            .insert([{}])

        if (!error) {
            sessionStorage.setItem(VISITS_SESSION_KEY, '1')
        }
    } catch (error) {
    }
}

export async function getVisitsCount() {
    try {
        const { count, error } = await supabase
            .from('site_visits')
            .select('*', { count: 'exact', head: true })

        if (error) return null
        return count ?? 0
    } catch (error) {
        return null
    }
}
