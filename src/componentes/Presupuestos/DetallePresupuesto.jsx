import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const cargarDatos = () => {
        setLoading(true);
        setError(null);
        try {
            const presupuestosGuardados = localStorage.getItem('presupuestos');
            const pedidosGuardados = localStorage.getItem('pedidos');
            const presupuestos = presupuestosGuardados ? JSON.parse(presupuestosGuardados) : [];
            const pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
            const encontrado = presupuestos.find(p => String(p.id) === String(id));
            if (encontrado) {
                setPresupuesto(encontrado);
                const pedidoRelacionado = pedidos.find(ped => String(ped.id) === String(encontrado.idPedido));
                setPedido(pedidoRelacionado || null);
            } else {
                setError('No se encontró el presupuesto');
            }
        } catch (error) {
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
                <p><strong>Pedido Asociado:</strong> #{presupuesto.idPedido}</p>
                <p><strong>Fecha:</strong> {new Date(presupuesto.createdDate).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {presupuesto.estado ? 'Pagado' : 'Pendiente'}</p>
            </div>
            {pedido && (
                <div className="pedido-relacionado">
                    <h3>Detalle del Pedido</h3>
                    <p><strong>Cliente:</strong> {pedido.cliente}</p>
                    <p><strong>Monto Total:</strong> ${pedido.montoTotal}</p>
                    <ul>
                        {pedido.productos.map((prod, idx) => (
                            <li key={idx}>{prod.nombre} x{prod.cantidad} - ${prod.subtotal}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
} 