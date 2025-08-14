import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '@/config';

const url = CONFIG.SUPABASE.url;
const key = CONFIG.SUPABASE.key;

if (!url || !key) {
    throw new Error('Supabase URL or KEY is missing');
}

const supabaseClient = createClient(url, key);
export { supabaseClient };
