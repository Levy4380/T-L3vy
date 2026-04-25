import { Outlet } from 'react-router-dom';

/**
 * Cáscara con header/footer; el “medio” lo pintan las rutas hijas vía <Outlet />.
 * Links fijos a / y /pagina1 para ver el flujo sin magia.
 */
function UnantenticatedLayout() {
    return (
        <div className="flex flex-col min-h-screen justify-between">
            <header>
               Tomas
            </header>

            <main className="flex-1 flex justify-center items-center">
                <Outlet />
            </main>

            <footer className="authenticated-layout__footer">
                <p className="authenticated-layout__footer-text">footer</p>
            </footer>
        </div>
    );
}

export default UnantenticatedLayout;
