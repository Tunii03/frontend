import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './ListaPagos.css';
import { buscarPagos } from '../../pages/Pago';
import { useTitulo } from '../../context/TituloContext';

export default function ListaPagos() {
    // Estado para la lista de pagos
    const [pagos, setPagos] = useState([]);
    // Estado para loading
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { titulo, setTitulo } = useTitulo();
    
    // Carga los pagos al montar el componente
    useEffect(() => {
        setTitulo('Pagos');
        cargarPagos();
    }, []);

    // Obtiene los pagos desde la API
    const cargarPagos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await buscarPagos();
            console.log('Pagos recibidos del backend:', response.data);
            setPagos(response.data);
        } catch (error) {
            console.error('Error al cargar pagos:', error);
            setError('Error al cargar los pagos');
        } finally {
            setLoading(false);
        }
    };

    // Navega al formulario de agregar pago
    const agregarPago = () => {
        navigate('/pago/agregar');
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
                                console.log('Procesando pago:', p);
                                
                                return (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>Presupuesto #{p.presupuestoId || ''}</td>
                                        <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</td>
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