import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './DetallePedido.css';

export default function DetallePedido() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPedido();
        // eslint-disable-next-line
    }, [id]);

    const cargarPedido = () => {
        setLoading(true);
        setError(null);
        try {
            const pedidosGuardados = localStorage.getItem('pedidos');
            const pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
            const pedidoEncontrado = pedidos.find(p => String(p.id) === String(id));
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
                        <p><strong>Cliente:</strong> {pedido.cliente}</p>
                        <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                    </div>

                    <div className="productos-pedido">
                        <h3>Productos</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.productos.map((producto, index) => (
                                    <tr key={index}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>${producto.precio}</td>
                                        <td>${producto.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                    <td><strong>${pedido.montoTotal}</strong></td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
} 