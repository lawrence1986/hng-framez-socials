import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    // Get current session
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const s = data?.session ?? null;
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
      } catch (e) {
        console.warn('getSession error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (e) {
      console.warn('signOut error', e);
    }
  };

  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
    } catch (e) {
      console.warn('refreshSession error', e);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
