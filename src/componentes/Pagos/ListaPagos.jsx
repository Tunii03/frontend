import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './ListaPagos.css';
import { buscarPagos } from '../../pages/Pago';
import { buscarPresupuestos } from '../../pages/Presupuesto';
import { useTitulo } from '../../context/TituloContext';

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
    const { titulo, setTitulo } = useTitulo();
    // Carga los pagos y presupuestos al montar el componente
    useEffect(() => {
        setTitulo('Pagos');
        cargarPagos();
        cargarPresupuestos();
    }, []);

    // Obtiene los pagos desde la API
    const cargarPagos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await buscarPagos();
            setPagos(response.data);
        } catch (error) {
            setError('Error al cargar los pagos');
        } finally {
            setLoading(false);
        }
    };

    // Obtiene los presupuestos desde la API
    const cargarPresupuestos = async () => {
        try {
            const response = await buscarPresupuestos();
            setPresupuestos(response.data);
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
                <h1>{titulo}</h1>
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
                                        <td>{p.createdDate ? new Date(p.createdDate).toLocaleDateString() : ''}</td>
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