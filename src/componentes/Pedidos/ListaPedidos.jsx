import React, { useState, useEffect } from 'react';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ListaPedidos.css';
import AgregarPedido from './AgregarPedido.jsx';

export default function Pedidos() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarPedidos();
        cargarProductos();
        cargarClientes();
    }, []);

    const cargarPedidos = () => {
        setLoading(true);
        setError(null);
        try {
            const guardados = localStorage.getItem('pedidos');
            setPedidos(guardados ? JSON.parse(guardados) : []);
        } catch (error) {
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const cargarProductos = () => {
        try {
            const productosGuardados = localStorage.getItem('productos');
            if (productosGuardados) {
                setProductos(JSON.parse(productosGuardados));
            }
        } catch (error) {
            setError('Error al cargar los productos');
        }
    };

    const cargarClientes = () => {
        try {
            const clientesGuardados = localStorage.getItem('clientes');
            if (clientesGuardados) {
                setClientes(JSON.parse(clientesGuardados));
            } else {
                setClientes([]);
            }
        } catch (error) {
            setError('Error al cargar los clientes');
        }
    };

    const verDetalle = (id) => {
        navigate(`/pedidos/${id}`);
    };

    const editarPedido = (id) => {
        navigate(`/pedidos/editar/${id}`);
    };

    const eliminarPedido = (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este pedido?')) {
            try {
                const guardados = localStorage.getItem('pedidos');
                const pedidosArray = guardados ? JSON.parse(guardados) : [];
                const nuevos = pedidosArray.filter(p => p.id !== id);
                localStorage.setItem('pedidos', JSON.stringify(nuevos));
                setPedidos(nuevos);
            } catch (error) {
                setError('Error al eliminar el pedido');
            }
        }
    };

    return (
        <div className="pedidos-container">
            <div className="header-pedidos">
                <h1>Pedidos</h1>
                <Button variant="primary" onClick={() => setMostrarModal(true)}>
                    <FaPlus /> Nuevo Pedido
                </Button>
            </div>

            {error && (
                <Alert variant="danger" className="mb-3">
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover className="tabla-pedidos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.length === 0 ? (
                            <tr><td colSpan="5">No hay pedidos registrados.</td></tr>
                        ) : (
                            pedidos.map(pedido => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                                    <td>${pedido.montoTotal}</td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm"
                                            onClick={() => verDetalle(pedido.id)}
                                            className="me-2"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => editarPedido(pedido.id)}
                                            className="me-2"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => eliminarPedido(pedido.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
            <AgregarPedido
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                onPedidoAgregado={(nuevo) => {
                    setPedidos(prev => [...prev, nuevo]);
                }}
                productosGlobal={productos}
                clientesGlobal={clientes}
            />
        </div>
    );
} 