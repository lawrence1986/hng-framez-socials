import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { supabase } from "../config/supabase";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshSession: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Load current session and listen for auth changes
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const current = data?.session ?? null;
        if (!mounted) return;
        setSession(current);
        setUser(current?.user ?? null);
      } catch (e) {
        console.warn("getSession error", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session ?? null);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // 🔹 Sign up new user (mobile + web safe)
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // ✅ Safe redirect URL handling
      const redirectTo =
        Platform.OS === "web"
          ? `${window.location.origin}/`
          : Constants.manifest?.extra?.redirectUrl ||
            "https://framez-socials.vercel.app";

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullName },
          emailRedirectTo: redirectTo,
        },
      });

      return { error };
    } catch (error) {
      console.error("signUp error:", error);
      return { error };
    }
  };

  // 🔹 Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("signIn error:", error);
      return { error };
    }
  };

  // 🔹 Sign out user
 const signOut = async () => {
  try {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();

    // Supabase v2 sometimes returns error even if session clears correctly
    if (error && !error.message.includes('No current session')) {
      console.error('Supabase signOut error:', error);
      Alert.alert('Logout Error', error.message || 'Unexpected error during logout.');
      return;
    }

    // Clear local session manually for safety
    setUser(null);
    setSession(null);

    // Also clear AsyncStorage in case Supabase didn’t clean it up
    try {
      await AsyncStorage.removeItem('sb-localhost-auth-token');
    } catch (storageErr) {
      console.warn('Failed to clear AsyncStorage auth token:', storageErr);
    }

    console.log('✅ User signed out successfully');
  } catch (err) {
    console.error('Unexpected logout error:', err);
    Alert.alert('Logout Error', err.message || 'An unexpected error occurred during logout.');
  }
};


  // 🔹 Refresh session manually
  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
    } catch (error) {
      console.warn("refreshSession error", error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🔹 Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
