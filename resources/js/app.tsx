import { createRoot } from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
    useLocation,
    type RouteProps,
} from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AutenticatedLayout from './layouts/AutenticatedLayout';
import UnantenticatedLayout from './layouts/UnantenticatedLayout';
import Pagina1 from './pages/Pagina1';
import { AuthProvider, useAuth } from './context/AuthContext';
import Index from './pages/Index';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';

/**
 * Layout de ruta: si no hay sesión, manda a /login. Los hijos son las pantallas con Outlet.
 * `isAuthenticated` lo pasás vos desde arriba (estado de App) — a propósito, sin context.
 */
function RequireAuth({ isAuthenticated }: { isAuthenticated: boolean }) {
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Outlet />;
}

function NotRequiredAuth({ isAuthenticated }: { isAuthenticated: boolean }) {
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <UnantenticatedLayout />;
}

function App() {
    const {isAuthenticated, sessionChecked, login, register, logout} =
        useAuth();
    const publicRoutes: RouteProps[] = [
        { path: '/login', element: <LoginPage onLogin={login} /> },
        { path: '/register', element: <RegisterPage onRegister={register} /> },
    ];
    const privateRoutes: RouteProps[] = [
        {
            index: true,
            element: <Index />,
        },
        { path: 'pagina1', element: <Pagina1 /> },
    ];

    if (!sessionChecked) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<NotRequiredAuth isAuthenticated={isAuthenticated} />}>
                    {publicRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>
                <Route
                    path="/"
                    element={<RequireAuth isAuthenticated={isAuthenticated} />}
                >
                    <Route element={<AutenticatedLayout onLogout={logout} />}>
                        {privateRoutes.map((route) => (
                            <Route
                                key={route.path ?? 'index'}
                                index={route.index}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>
                <Route
                    path="*"
                    element={
                        <Navigate
                            to={isAuthenticated ? '/' : '/login'}
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
if (container) {
    createRoot(container).render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
