import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Pull from Expo env (works for web + mobile)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;



// 🔹 Warn clearly if missing (so you notice during Vercel build)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "❌ Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env or Vercel settings."
  );
}

// 🔹 Use proper storage depending on platform
const isWeb = typeof window !== "undefined";

const storage = isWeb
  ? undefined // Supabase web SDK uses localStorage automatically
  : {
      getItem: async (key: string) => AsyncStorage.getItem(key),
      setItem: async (key: string, value: string) => AsyncStorage.setItem(key, value),
      removeItem: async (key: string) => AsyncStorage.removeItem(key),
    };

// 🔹 Create client (v2 syntax)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Required for web email magic link and redirects
  },
  global: {
    headers: { "x-client-info": "framez-app" },
  },
});

// ✅ Utility: check if storage bucket exists
export async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn("Error listing buckets:", error.message);
      return false;
    }
    return data?.some((b) => b.name === bucketName) ?? false;
  } catch (err) {
    console.error("bucketExists exception:", err);
    return false;
  }
}