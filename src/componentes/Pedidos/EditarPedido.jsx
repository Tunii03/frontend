import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Table, Alert } from 'react-bootstrap';
import './ListaPedidos.css';
import { obtenerPedido, actualizarPedido } from '../../pages/Pedido';
import { buscarClientes } from '../../pages/Cliente';
import { buscarProductos } from '../../pages/Producto';

export default function EditarPedido() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedido, setPedido] = useState(null);
    const [clienteId, setClienteId] = useState('');
    const [productosPedido, setProductosPedido] = useState([]);
    const [montoTotal, setMontoTotal] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const clientesResp = await buscarClientes();
            setClientes(clientesResp.data);
            const productosResp = await buscarProductos();
            setProductos(productosResp.data);
            const pedidoEncontrado = await obtenerPedido(id);
            if (pedidoEncontrado) {
                setPedido(pedidoEncontrado);
                setClienteId(pedidoEncontrado.clienteId || '');
                setProductosPedido(pedidoEncontrado.productos || []);
                setMontoTotal(pedidoEncontrado.montoTotal || 0);
            } else {
                setError('No se encontró el pedido');
            }
        } catch (error) {
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
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
            setProductosPedido(prev => [...prev, productoConCantidad]);
            setMontoTotal(prev => prev + productoConCantidad.subtotal);
            setProductoSeleccionado('');
            setCantidad(1);
        }
    };

    const eliminarProductoDelPedido = (index) => {
        const productoAEliminar = productosPedido[index];
        setProductosPedido(prev => prev.filter((_, i) => i !== index));
        setMontoTotal(prev => prev - productoAEliminar.subtotal);
    };

    const cambiarCantidadProducto = (index, nuevaCantidad) => {
        setProductosPedido(prev => prev.map((p, i) => {
            if (i === index) {
                const nuevoSubtotal = p.precio * nuevaCantidad;
                return { ...p, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
            }
            return p;
        }));
        setTimeout(() => {
            setMontoTotal(productosPedido.reduce((acc, p, i) => i === index ? acc + p.precio * nuevaCantidad : acc + p.subtotal, 0));
        }, 0);
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setError(null);
        if (!clienteId || productosPedido.length === 0) {
            setError('Debe seleccionar un cliente y al menos un producto');
            return;
        }
        try {
            await actualizarPedido({
                id,
                monto: productosPedido.reduce((acc, p) => acc + p.subtotal, 0)
            });
            navigate('/pedidos');
        } catch (error) {
            setError('Error al guardar los cambios');
        }
    };

    if (loading) {
        return <div className="formulario"><span>Cargando...</span></div>;
    }
    if (error) {
        return <div className="formulario"><div className="alert alert-danger">{error}</div></div>;
    }

    return (
        <form onSubmit={handleGuardar} className="formulario">
            <h2>Editar Pedido</h2>
            <div className="form-group">
                <label>Cliente:</label>
                <Form.Select
                    value={clienteId}
                    onChange={e => setClienteId(e.target.value)}
                    required
                >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} ({c.cuit})</option>
                    ))}
                </Form.Select>
            </div>
            <div className="form-group">
                <label>Agregar Producto:</label>
                <div className="agregar-producto">
                    <Form.Select
                        value={productoSeleccionado}
                        onChange={e => setProductoSeleccionado(e.target.value)}
                    >
                        <option value="">Seleccione un producto</option>
                        {productos.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={e => setCantidad(Number(e.target.value))}
                        style={{ maxWidth: '100px', marginLeft: '10px' }}
                    />
                    <Button variant="secondary" onClick={agregarProductoAlPedido} style={{ marginLeft: '10px' }}>
                        Agregar Producto
                    </Button>
                </div>
            </div>
            <div className="productos-agregados">
                <h4>Productos en el pedido:</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosPedido.map((p, index) => (
                            <tr key={index}>
                                <td>{p.nombre}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={p.cantidad}
                                        onChange={e => cambiarCantidadProducto(index, Number(e.target.value))}
                                        style={{ maxWidth: '80px' }}
                                    />
                                </td>
                                <td>${p.precio}</td>
                                <td>${p.subtotal}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => eliminarProductoDelPedido(index)}>
                                        Quitar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="total-pedido">
                    <strong>Total: ${productosPedido.reduce((acc, p) => acc + p.subtotal, 0)}</strong>
                </div>
            </div>
            <Button type="submit" variant="primary" className="mt-3">
                Guardar Cambios
            </Button>
            <Button type="button" variant="secondary" className="mt-3 ms-2" onClick={() => navigate('/pedidos')}>
                Cancelar
            </Button>
        </form>
    );
} 