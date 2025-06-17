import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './ListaPagos.css';

export default function ListaPagos() {
    // Estado para la lista de pagos
    const [pagos, setPagos] = useState([]);
    // Estado para la lista de presupuestos
    const [presupuestos, setPresupuestos] = useState([]);
    // Estado para loading
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Carga los pagos y presupuestos al montar el componente
    useEffect(() => {
        cargarPagos();
        cargarPresupuestos();
    }, []);

    // Obtiene los pagos desde localStorage
    const cargarPagos = () => {
        setLoading(true);
        setError(null);
        try {
            const guardados = localStorage.getItem('pagos');
            setPagos(guardados ? JSON.parse(guardados) : []);
        } catch (error) {
            setError('Error al cargar los pagos');
        } finally {
            setLoading(false);
        }
    };

    // Obtiene los presupuestos desde localStorage
    const cargarPresupuestos = () => {
        try {
            const guardados = localStorage.getItem('presupuestos');
            setPresupuestos(guardados ? JSON.parse(guardados) : []);
        } catch (error) {
            setPresupuestos([]);
        }
    };

    // Navega al formulario de agregar pago
    const agregarPago = () => {
        navigate('/pago/agregar');
    };

    // Busca un presupuesto por id
    const obtenerPresupuesto = (idPresupuesto) => {
        return presupuestos.find(p => String(p.id) === String(idPresupuesto));
    };

    return (
        <div className="pagos-container">
            <div className="header-pagos">
                <h1>Pagos</h1>
                <button className="btn-agregar" onClick={agregarPago}>
                    <FaPlus /> Nuevo Pago
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="tabla-pagos-wrapper">
                <table className="tabla-pagos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Presupuesto</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3">Cargando...</td></tr>
                        ) : pagos.length === 0 ? (
                            <tr><td colSpan="3">No hay pagos registrados.</td></tr>
                        ) : (
                            pagos.map(p => {
                                const presupuesto = obtenerPresupuesto(p.idPresupuesto);
                                return (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{presupuesto ? `#${presupuesto.id}` : p.idPresupuesto}</td>
                                        <td>{new Date(p.createdDate).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 