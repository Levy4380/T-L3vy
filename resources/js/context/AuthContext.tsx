import { createContext, useContext, type ReactNode } from 'react';
import { useSessionAuth } from '../hooks/useSessionAuth';

type AuthContextValue = ReturnType<typeof useSessionAuth>;

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useSessionAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}

export { AuthProvider, useAuth };
