import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './DetallePedido.css';
import { obtenerPedido } from '../../pages/Pedido';

export default function DetallePedido() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Estado para el pedido actual
    const [pedido, setPedido] = useState([]);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(true);

    // Carga el pedido al montar o cambiar el id
    useEffect(() => {
        cargarPedido();
    }, [id]);

    // Busca el pedido por id en la API
    const cargarPedido = async () => {
        setLoading(true);
        setError(null);
        try {
            const pedidoEncontrado = await obtenerPedido(id);
            console.log({pedidoEncontrado})
            if (pedidoEncontrado) {
                setPedido(pedidoEncontrado);
            } else {
                setError('No se encontró el pedido');
            }
        } catch (error) {
            setError('Error al cargar el pedido');
        } finally {
            setLoading(false);
        }   
    };
  
    if (loading) {
        // Muestra un mensaje de carga
        return (
            <div className="detalle-pedido">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            </div>
        );
    }

    if (error) {
        // Muestra errores y un mensaje
        return (
            <div className="detalle-pedido">
                <div className="pedido-no-encontrado">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                    <Button variant="primary" onClick={() => navigate('/pedidos')}>
                        Volver a Pedidos
                    </Button>
                </div>
            </div>
        );
    }

    if (!pedido) {
        return null;
    }

    return (
        <div className="detalle-pedido">
            <div className="header-detalle">
                <Button variant="outline-primary" onClick={() => navigate('/pedidos')}>
                    <FaArrowLeft /> Volver
                </Button>
                <h1>Detalle del Pedido #{pedido.id}</h1>
            </div>

            <Card className="info-pedido">
                <Card.Body>
                    <div className="info-cliente">
                        <h3>Información del Cliente</h3>
                        <p><strong>Cliente: </strong>{pedido.cliente ? `${pedido.cliente.nombre} (${pedido.cliente.cuit})` : pedido.clienteId}</p>
                        <p><strong>Fecha: </strong>{pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : new Date(pedido.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p><strong>Total:</strong> ${pedido.monto}</p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
} 