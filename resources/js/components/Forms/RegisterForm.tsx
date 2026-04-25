import { useState, type FormEvent } from 'react';
import type { User } from '../../hooks/useSessionAuth';
import Input from '../Input';

interface RegisterProps {
    onRegister: (username: string, password: string) => Promise<User>;
    onSwitchToLogin: () => void;
}

function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await onRegister(username, password);
        } catch (err: any) {
            setError(
                err.message ||
                    err.errors?.username?.[0] ||
                    err.errors?.password?.[0] ||
                    'Registration failed',
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
                    <div>
                        <Input
                            type="text"
                            label="Username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            disabled={loading}
                        />
                                
                    </div>
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Input
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    disabled={loading}
                >
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
}


export default Register;
