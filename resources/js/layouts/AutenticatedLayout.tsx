import { Link, Outlet, useNavigate } from 'react-router-dom';

interface AutenticatedLayoutProps {
    onLogout: () => Promise<void>;
}

/**
 * Cáscara con header/footer; el “medio” lo pintan las rutas hijas vía <Outlet />.
 * Links fijos a / y /pagina1 para ver el flujo sin magia.
 */

function AutenticatedLayout({ onLogout }: AutenticatedLayoutProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await onLogout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-between">
            <header className="authenticated-layout__header">
                <nav className="flex gap-2 items-center">
                    <Link className="authenticated-layout__nav-button" to="/">
                        Home
                    </Link>
                    <Link className="authenticated-layout__nav-button" to="/pagina1">
                        Página 1
                    </Link>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="authenticated-layout__footer">
                <p className="authenticated-layout__footer-text">footer</p>
            </footer>
        </div>
    );
}

export default AutenticatedLayout;
