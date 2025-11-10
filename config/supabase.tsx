import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure these env vars are set in Expo: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://atceofuytcveppcojsop.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or ANON KEY is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env');
}

// AsyncStorage adapter for Supabase Auth (React Native)
const AsyncStorageAdapter = {
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
      console.warn('AsyncStorage getItem error', e);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn('AsyncStorage setItem error', e);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('AsyncStorage removeItem error', e);
    }
  },
};

// Create Supabase client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // @ts-ignore - supabase-js types don't yet include react-native storage adapter typing in some versions
    storage: AsyncStorageAdapter,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': 'framez-app',
    },
  },
});

// Utility to check if bucket exists (used by upload logic)
export async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn('Error listing buckets', error);
      return false;
    }
    return Array.isArray(data) && data.some((b: any) => b.name === bucketName);
  } catch (e) {
    console.warn('bucketExists exception', e);
    return false;
  }
}
