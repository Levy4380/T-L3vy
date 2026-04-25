import { useAuth } from '../context/AuthContext';

function HelloWorld() {
    const { user } = useAuth();
    return (
        <div className="bg-red-500">
            <div>
                <h1>Hello World</h1>
                {user && (
                    <p>
                        Welcome, <strong>{user.username}</strong>!
                        {user.isAdmin && <span>You are an admin</span>}
                    </p>
                )}
            </div>
        </div>
    );
}

export default HelloWorld;
