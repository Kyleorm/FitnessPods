import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hrehdtpewfdtjfyhkzws.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZWhkdHBld2ZkdGpmeWhrendzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Njg0MjIsImV4cCI6MjA5MjU0NDQyMn0.w1Iu0GzCMlaomtjjE7u_0GJOYuFfE_NSVjlSeJV7dg8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
