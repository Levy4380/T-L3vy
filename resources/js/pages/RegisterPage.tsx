import Register from '../components/Forms/RegisterForm';
import { useNavigate } from 'react-router-dom';
import type { User } from '../hooks/useSessionAuth';
import MacTypeContainer from '../components/MacTypeContainer';


function RegisterPage({
    onRegister,
}: {
    onRegister: (username: string, password: string) => Promise<User>;
}) {
    const navigate = useNavigate();

    return (
        <MacTypeContainer>
            <h2>Register</h2>
            <Register
                onRegister={onRegister}
                onSwitchToLogin={() => navigate('/login')}
            />
        </MacTypeContainer>
    );
}

export default RegisterPage;