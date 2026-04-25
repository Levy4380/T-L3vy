import { useState, type FormEvent } from 'react';
import type { User } from '../../hooks/useSessionAuth';
import Input from '../Input';

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<User>;
    onSwitchToRegister: () => void;
}

function Login({ onLogin, onSwitchToRegister }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onLogin(username, password);
        } catch (err: any) {
            setError(
                err.message ||
                    err.errors?.username?.[0] ||
                    err.errors?.password?.[0] ||
                    'Login failed',
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div>
                {error && <div>{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[350px]">
                    <div className="relative">
                        <Input
                            type="text"
                            label="Username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            placeholder=" "
                            autoComplete="username"
                        />
                    </div>
                    <div className="relative">
                        <Input
                            type="password"
                            label="Password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            placeholder=" "
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    disabled={loading}
                >
                    Don't have an account? Register
                </button>
            </div>
        </div>
    );
}


export default Login;
