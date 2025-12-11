import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import HelloWorld from './components/HelloWorld';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';

interface User {
    id: number;
    username: string;
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/check-auth');
            if (response.data.authenticated) {
                setIsAuthenticated(true);
                setUser(response.data.user);
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await axios.post('/login', { username, password });
            if (response.data.success) {
                setIsAuthenticated(true);
                setUser(response.data.user);
            }
        } catch (error: any) {
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const handleRegister = async (username: string, password: string) => {
        try {
            const response = await axios.post('/register', { username, password });
            if (response.data.success) {
                // Auto login after registration
                await handleLogin(username, password);
            }
        } catch (error: any) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return showRegister ? (
            <Register
                onRegister={handleRegister}
                onSwitchToLogin={() => setShowRegister(false)}
            />
        ) : (
            <Login
                onLogin={handleLogin}
                onSwitchToRegister={() => setShowRegister(true)}
            />
        );
    }

    return <HelloWorld user={user} onLogout={handleLogout} />;
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

