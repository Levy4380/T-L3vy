import React from 'react';

interface User {
    id: number;
    username: string;
}

interface HelloWorldProps {
    user: User | null;
    onLogout: () => void;
}

const HelloWorld: React.FC<HelloWorldProps> = ({ user, onLogout }) => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Hello World</h1>
                {user && (
                    <p style={styles.welcome}>
                        Welcome, <strong>{user.username}</strong>!
                    </p>
                )}
                <button onClick={onLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '300px',
    },
    title: {
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '1rem',
    },
    welcome: {
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '2rem',
    },
    logoutButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default HelloWorld;

