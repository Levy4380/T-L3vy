import { Link } from 'react-router-dom';

function Pagina1() {
    return (
        <div>
            <h1>Página 1</h1>
            <p>
                Ruta de prueba: <code>/pagina1</code>
            </p>
            <p>
                <Link to="/">Volver a inicio</Link>
            </p>
        </div>
    );
}

export default Pagina1;
