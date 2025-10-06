import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://msaisnrsgrlbyhxiaowt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_LBMfkufkwXkJOippiGPdYA_2_F8ca-d'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
