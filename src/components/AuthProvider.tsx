'use client';

import React from 'react';
import type { AuthUser, RegisterPayload } from '@/src/types/auth';
import { fetchCurrentUser, isUnauthorized, login, registerAccount } from '@/src/utils/api';
import { clearAuthToken, readAuthToken, storeAuthToken } from '@/src/utils/authToken';

type AuthState =
  | { status: 'loading'; user: null; token: null }
  | { status: 'signedOut'; user: null; token: null }
  | { status: 'signedIn'; user: AuthUser; token: string };

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => void;
};

const signedOut: AuthState = { status: 'signedOut', user: null, token: null };

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ status: 'loading', user: null, token: null });

  const startSession = React.useCallback(async (token: string) => {
    const user = await fetchCurrentUser(token);
    storeAuthToken(token);
    setState({ status: 'signedIn', user, token });
  }, []);

  React.useEffect(() => {
    const token = readAuthToken();
    if (!token) {
      setState(signedOut);
      return;
    }
    startSession(token).catch((error) => {
      // Keep the token through transient network errors; drop it once the server rejects it.
      if (isUnauthorized(error)) clearAuthToken();
      setState(signedOut);
    });
  }, [startSession]);

  const signIn = React.useCallback(
    async (email: string, password: string) => {
      const { access_token } = await login(email, password);
      await startSession(access_token);
    },
    [startSession]
  );

  const signUp = React.useCallback(
    async (payload: RegisterPayload) => {
      const { access_token } = await registerAccount(payload);
      await startSession(access_token);
    },
    [startSession]
  );

  const signOut = React.useCallback(() => {
    clearAuthToken();
    setState(signedOut);
  }, []);

  const value = React.useMemo(() => ({ ...state, signIn, signUp, signOut }), [state, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
