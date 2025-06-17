import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye } from 'react-icons/fa';
import './ListaPresupuestos.css';

export default function ListaPresupuestos() {
    // Estado para la lista de presupuestos
    const [presupuestos, setPresupuestos] = useState([]);
    // Estado para loading
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Carga los presupuestos al montar el componente
    useEffect(() => {
        cargarPresupuestos();
    }, []);

    // Obtiene los presupuestos desde localStorage
    const cargarPresupuestos = () => {
        setLoading(true);
        setError(null);
        try {
            const guardados = localStorage.getItem('presupuestos');
            setPresupuestos(guardados ? JSON.parse(guardados) : []);
        } catch (error) {
            setError('Error al cargar los presupuestos');
        } finally {
            setLoading(false);
        }
    };

    // Navega al detalle del presupuesto
    const verDetallePresupuesto = (id) => {
        navigate(`/presupuestos/${id}`);
    };

    // Navega al formulario de agregar presupuesto
    const agregarPresupuesto = () => {
        navigate('/presupuestos/agregar');
    };

    return (
        <div className="presupuestos-container">
            <div className="header-presupuestos">
                <h1>Presupuestos</h1>
                <button className="btn-agregar" onClick={agregarPresupuesto}>
                    <FaPlus /> Nuevo Presupuesto
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="tabla-presupuestos-wrapper">
                <table className="tabla-presupuestos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pedido</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Cargando...</td></tr>
                        ) : presupuestos.length === 0 ? (
                            <tr><td colSpan="5">No hay presupuestos registrados.</td></tr>
                        ) : (
                            presupuestos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.idPedido}</td>
                                    <td>{new Date(p.createdDate).toLocaleDateString()}</td>
                                    <td>{p.estado ? 'Pagado' : 'Pendiente'}</td>
                                    <td>
                                        <button className="btn-ver" title="Ver Detalle" onClick={() => verDetallePresupuesto(p.id)}><FaEye /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 