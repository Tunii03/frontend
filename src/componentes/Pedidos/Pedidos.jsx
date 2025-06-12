import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { crearPedido, agregarProducto, obtenerPedidos } from '../../pages/Pedido';
import './Pedidos.css';

export default function Pedidos() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoPedido, setNuevoPedido] = useState({
        cliente: '',
        productos: [],
        montoTotal: 0
    });
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarPedidos();
        cargarProductos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerPedidos();
            setPedidos(data);
        } catch (error) {
            setError(error.message || 'Error al cargar los pedidos');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarProductos = async () => {
        try {
            const productosGuardados = localStorage.getItem('productos');
            if (productosGuardados) {
                setProductos(JSON.parse(productosGuardados));
            }
        } catch (error) {
            setError('Error al cargar los productos');
            console.error(error);
        }
    };

    const agregarProductoAlPedido = () => {
        const producto = productos.find(p => p.id === Number(productoSeleccionado));
        if (producto) {
            const productoConCantidad = {
                ...producto,
                cantidad: Number(cantidad),
                subtotal: producto.precio * Number(cantidad)
            };
            setNuevoPedido(prev => ({
                ...prev,
                productos: [...prev.productos, productoConCantidad],
                montoTotal: prev.montoTotal + productoConCantidad.subtotal
            }));
            setProductoSeleccionado('');
            setCantidad(1);
        }
    };

    const eliminarProductoDelPedido = (index) => {
        const productoAEliminar = nuevoPedido.productos[index];
        setNuevoPedido(prev => ({
            ...prev,
            productos: prev.productos.filter((_, i) => i !== index),
            montoTotal: prev.montoTotal - productoAEliminar.subtotal
        }));
    };

    const guardarPedido = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Crear el pedido
            const pedidoCreado = await crearPedido({
                monto: nuevoPedido.montoTotal,
                idcliente: nuevoPedido.cliente
            });

            // Agregar cada producto al pedido
            for (const producto of nuevoPedido.productos) {
                await agregarProducto({
                    idPedido: pedidoCreado.id,
                    idProducto: producto.id,
                    cantidad: producto.cantidad,
                    monto: producto.subtotal
                });
            }

            // Actualizar la lista de pedidos
            await cargarPedidos();
            
            // Limpiar el formulario
            setNuevoPedido({
                cliente: '',
                productos: [],
                montoTotal: 0
            });
            setMostrarModal(false);
        } catch (error) {
            setError(error.message || 'Error al guardar el pedido');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const verDetalle = (id) => {
        navigate(`/pedidos/${id}`);
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
                        {pedidos.map(pedido => (
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
                                    >
                                        <FaEye /> Ver Detalle
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoPedido.cliente}
                                onChange={e => setNuevoPedido(prev => ({ ...prev, cliente: e.target.value }))}
                                placeholder="Nombre del cliente"
                            />
                        </Form.Group>

                        <div className="agregar-producto">
                            <Form.Group className="mb-3">
                                <Form.Label>Producto</Form.Label>
                                <Form.Select
                                    value={productoSeleccionado}
                                    onChange={e => setProductoSeleccionado(e.target.value)}
                                >
                                    <option value="">Seleccione un producto</option>
                                    {productos.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre} - ${p.precio}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={cantidad}
                                    onChange={e => setCantidad(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="secondary" onClick={agregarProductoAlPedido}>
                                Agregar Producto
                            </Button>
                        </div>

                        {nuevoPedido.productos.length > 0 && (
                            <div className="productos-agregados">
                                <h4>Productos en el pedido:</h4>
                                <ul>
                                    {nuevoPedido.productos.map((p, index) => (
                                        <li key={index}>
                                            {p.nombre} x{p.cantidad} - ${p.subtotal}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => eliminarProductoDelPedido(index)}
                                            >
                                                Eliminar
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <h5>Total: ${nuevoPedido.montoTotal}</h5>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={guardarPedido}
                        disabled={loading || !nuevoPedido.cliente || nuevoPedido.productos.length === 0}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                {' '}Guardando...
                            </>
                        ) : (
                            'Guardar Pedido'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
} 