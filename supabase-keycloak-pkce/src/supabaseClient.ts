import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dofbnufqodacemdmwxqy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZmJudWZxb2RhY2VtZG13eHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzYwNzcsImV4cCI6MjA1ODU1MjA3N30.8N6S1DhDgVvglD-hh9ijbbre4CZzXdVFbw6ak1kn1j4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
  },
});
