const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // <-- notice the correct name!

export const supabase = createClient(supabaseUrl, supabaseKey);
