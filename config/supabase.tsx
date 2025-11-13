import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig.extra;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables inside app.json');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
