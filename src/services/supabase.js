// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ Cambiá estos valores por los de tu proyecto en Supabase (Settings > API)
const supabaseUrl = 'https://TU_PROYECTO.supabase.co'
const supabaseAnonKey = 'TU_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
