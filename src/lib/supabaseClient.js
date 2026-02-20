import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yviucvkrjuriopfzndne.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aXVjdmtyanVyaW9wZnpuZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NTk3NjAsImV4cCI6MjA4NzEzNTc2MH0.qQRm7ncTPsZ-HiBXFw63egJ5uey3W7TQ42L2yp9II3Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
