import React, { useState, useEffect } from 'react';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ListaPedidos.css';
import AgregarPedido from './AgregarPedido.jsx';
import { obtenerPedidos, eliminarPedido } from '../../pages/Pedido';
import { buscarProductos } from '../../pages/Producto';
import { buscarClientes } from '../../pages/Cliente';
import { useTitulo } from '../../context/TituloContext';

export default function Pedidos() {
    const navigate = useNavigate();
    // Estado para la lista de pedidos
    const [pedidos, setPedidos] = useState([]);
    // Estado para mostrar el modal de agregar pedido
    const [mostrarModal, setMostrarModal] = useState(false);
    // Estado para la lista de productos
    const [productos, setProductos] = useState([]);
    // Estado para la lista de clientes
    const [clientes, setClientes] = useState([]);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(false);
    const { titulo, setTitulo } = useTitulo();
    // Carga pedidos, productos y clientes al montar el componente
    useEffect(() => {
        setTitulo('Pedidos');
        cargarPedidos();
        cargarProductos();
        cargarClientes();
    }, []);

    // Obtiene los pedidos desde la API
    const cargarPedidos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerPedidos();
            setPedidos(data);
        } catch (error) {
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    // Obtiene los productos desde la API
    const cargarProductos = async () => {
        try {
            const response = await buscarProductos();
            setProductos(response.data);
        } catch (error) {
            setError('Error al cargar los productos');
        }
    };

    // Obtiene los clientes desde la API
    const cargarClientes = async () => {
        try {
            const response = await buscarClientes();
            setClientes(response.data);
        } catch (error) {
            setError('Error al cargar los clientes');
        }
    };

    // Navega al detalle del pedido
    const verDetalle = (id) => {
        navigate(`/pedidos/${id}`);
    };

    // Navega a la edición del pedido
    const editarPedido = (id) => {
        navigate(`/pedidos/editar/${id}`);
    };

    // Elimina un pedido por id, con confirmación y usando la API
    const handleEliminarPedido = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este pedido?')) {
            try {
                await eliminarPedido(id);
                setPedidos(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                setError('Error al eliminar el pedido');
            }
        }
    };

    return (
        <div className="pedidos-container">
            <div className="header-pedidos">
                <h1>{titulo}</h1>
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
                                    <td>{pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : ''}</td>
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
                                            onClick={() => handleEliminarPedido(pedido.id)}
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