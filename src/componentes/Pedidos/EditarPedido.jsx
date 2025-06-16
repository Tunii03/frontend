import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Table, Alert } from 'react-bootstrap';
import './ListaPedidos.css';

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
        // eslint-disable-next-line
    }, [id]);

    const cargarDatos = () => {
        setLoading(true);
        setError(null);
        try {
            // Cargar clientes
            const clientesGuardados = localStorage.getItem('clientes');
            setClientes(clientesGuardados ? JSON.parse(clientesGuardados) : []);
            // Cargar productos
            const productosGuardados = localStorage.getItem('productos');
            setProductos(productosGuardados ? JSON.parse(productosGuardados) : []);
            // Cargar pedido
            const pedidosGuardados = localStorage.getItem('pedidos');
            const pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
            const pedidoEncontrado = pedidos.find(p => String(p.id) === String(id));
            if (pedidoEncontrado) {
                setPedido(pedidoEncontrado);
                setClienteId(
                    clientesGuardados
                        ? (JSON.parse(clientesGuardados).find(c => c.nombre === pedidoEncontrado.cliente)?.id || '')
                        : ''
                );
                setProductosPedido(pedidoEncontrado.productos);
                setMontoTotal(pedidoEncontrado.montoTotal);
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
        // Recalcular el total
        setTimeout(() => {
            setMontoTotal(productosPedido.reduce((acc, p, i) => i === index ? acc + p.precio * nuevaCantidad : acc + p.subtotal, 0));
        }, 0);
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        setError(null);
        if (!clienteId || productosPedido.length === 0) {
            setError('Debe seleccionar un cliente y al menos un producto');
            return;
        }
        try {
            const pedidosGuardados = localStorage.getItem('pedidos');
            let pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
            const clienteSeleccionado = clientes.find(c => String(c.id) === String(clienteId));
            pedidos = pedidos.map(p =>
                String(p.id) === String(id)
                    ? {
                        ...p,
                        cliente: clienteSeleccionado ? clienteSeleccionado.nombre : '',
                        clienteId: clienteId,
                        productos: productosPedido,
                        montoTotal: productosPedido.reduce((acc, p) => acc + p.subtotal, 0)
                    }
                    : p
            );
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
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
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <h5>Total: ${productosPedido.reduce((acc, p) => acc + p.subtotal, 0)}</h5>
            </div>
            <button type="submit" className="btn-submit">Guardar Cambios</button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/pedidos')}>Cancelar</button>
        </form>
    );
} 