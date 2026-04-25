import { useNavigate } from 'react-router-dom';
import Login from '../components/Forms/LoginForm';
import type { User } from '../hooks/useSessionAuth';
import MacTypeContainer from '../components/MacTypeContainer';

function LoginPage({
    onLogin,
}: {
    onLogin: (username: string, password: string) => Promise<User>;
}) {
    const navigate = useNavigate();

    return (
        <MacTypeContainer>
            <h2>Login</h2>
            <Login
                onLogin={onLogin}
                onSwitchToRegister={() => navigate('/register')}
            />
        </MacTypeContainer>
    );
}

export default LoginPage;
