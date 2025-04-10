//supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjfnlefaqumhtnexmvgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZm5sZWZhcXVtaHRuZXhtdmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMTA1NzQsImV4cCI6MjA1OTg4NjU3NH0.RYZFk17R9E7raNZHRExEYA84MtnrECiXOTMf639MOF8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);