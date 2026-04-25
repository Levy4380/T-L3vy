import { useEffect, useState } from 'react';
import axios from 'axios';

export interface User {
    id: number;
    username: string;
    isAdmin: boolean;
}

export function useSessionAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await axios.get('/check-auth');
                if (active && res.data.authenticated) {
                    setUser(res.data.user);
                }
            } catch {
                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setSessionChecked(true);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    const login = async (
        username: string,
        password: string,
    ): Promise<User> => {
        try {
            const res = await axios.post('/login', { username, password });
            if (res.data.success && res.data.user) {
                const next: User = res.data.user;
                setUser(next);
                return next;
            }
            setUser(null);
            throw new Error(
                res.data.message ?? 'Login failed',
            );
        } catch (e) {
            setUser(null);
            throw e;
        }
    };

    const register = async (
        username: string,
        password: string,
    ): Promise<User> => {
        const res = await axios.post('/register', {
            username,
            password,
            isAdmin: false,
        });
        if (!res.data.success) {
            throw new Error(res.data.message ?? 'Registration failed');
        }
        return login(username, password);
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
        } finally {
            setUser(null);
        }
    };

    return {
        user,
        isAuthenticated: user !== null,
        sessionChecked,
        login,
        register,
        logout,
    };
}
