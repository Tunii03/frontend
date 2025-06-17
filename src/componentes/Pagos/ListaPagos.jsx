import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './ListaPagos.css';

export default function ListaPagos() {
    const [pagos, setPagos] = useState([]);
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargarPagos();
        cargarPresupuestos();
    }, []);

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

    const cargarPresupuestos = () => {
        try {
            const guardados = localStorage.getItem('presupuestos');
            setPresupuestos(guardados ? JSON.parse(guardados) : []);
        } catch (error) {
            setPresupuestos([]);
        }
    };

    const agregarPago = () => {
        navigate('/pago/agregar');
    };

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