import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mostrarPresupuesto } from '../../pages/Presupuesto';
import { obtenerPedido } from '../../pages/Pedido';
import './DetallePresupuesto.css';

export default function DetallePresupuesto() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Estado para el presupuesto actual
    const [presupuesto, setPresupuesto] = useState(null);
    // Estado para el pedido relacionado
    const [pedido, setPedido] = useState(null);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(true);

    // Carga los datos del presupuesto y pedido al montar o cambiar el id
    useEffect(() => {
        cargarDatos();
    }, [id]);

    // Busca el presupuesto y su pedido relacionado en localStorage
    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const presupuestoResponse = await mostrarPresupuesto(id);
            const presupuestoData = presupuestoResponse.data;
            console.log('Datos del presupuesto recibidos:', presupuestoData);
            setPresupuesto(presupuestoData);
            if (presupuestoData.pedidoId) {
                const pedidoData = await obtenerPedido(presupuestoData.pedidoId);
                setPedido(pedidoData);
            } else {
                setPedido(null);
            }
        } catch (error) {
            console.error('Error al cargar presupuesto:', error);
            setError('Error al cargar el presupuesto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        // Muestra un mensaje de carga
        return <div className="detalle-presupuesto"><span>Cargando...</span></div>;
    }
    if (error) {
        // Muestra errores y un mensaje
        return <div className="detalle-presupuesto"><div className="alert alert-danger">{error}</div></div>;
    }
    if (!presupuesto) return null;

    return (
        <div className="detalle-presupuesto">
            <div className="header-presupuesto">
                <h1>Detalle del Presupuesto #{presupuesto.id}</h1>
                <button className="btn-volver" onClick={() => navigate('/presupuestos')}>Volver a Presupuestos</button>
            </div>
            <div className="info-presupuesto">
                <p><strong>Pedido Asociado:</strong> #{presupuesto.pedidoId}</p>
                <p><strong>Fecha:</strong> {presupuesto.createdAt ? new Date(presupuesto.createdAt).toLocaleDateString() : ''}</p>
                <p><strong>Estado:</strong> {presupuesto.estado ? 'Pagado' : 'Pendiente'}</p>
            </div>
            
        </div>
    );
} 