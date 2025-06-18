import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import './AgregarPedido.css';
import { crearPedido, agregarProducto } from '../../pages/Pedido';

export default function AgregarPedido({
  show, onHide, onPedidoAgregado, productosGlobal, clientesGlobal
}) {
  // Estado para el nuevo pedido
  const [nuevoPedido, setNuevoPedido] = useState({
    clienteId: '',
    productos: [],
    montoTotal: 1.0
  });
  // Estado para la lista de productos y clientes
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  // Estado para el producto seleccionado y cantidad
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  // Estado para errores y loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Actualiza productos y clientes cuando cambian los props
  useEffect(() => {
    setProductos(productosGlobal || []);
    setClientes(clientesGlobal || []);
  }, [productosGlobal, clientesGlobal]);

  // Agrega un producto al pedido con validación de stock
  const agregarProductoAlPedido = () => {
    const producto = productos.find(p => p.id === Number(productoSeleccionado));
    if (producto) {
      const cantidadNum = Number(cantidad);
      if (cantidadNum > producto.stock) {
        setError(`No hay suficiente stock para "${producto.nombre}". Stock disponible: ${producto.stock}`);
        return;
      }
      setError(null);
      const productoConCantidad = {
        ...producto,
        cantidad: cantidadNum,
        subtotal: producto.precio * cantidadNum
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

  // Elimina un producto del pedido
  const eliminarProductoDelPedido = (index) => {
    const productoAEliminar = nuevoPedido.productos[index];
    setNuevoPedido(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
      montoTotal: prev.montoTotal - productoAEliminar.subtotal
    }));
  };

  const guardarPedido = async () => {
    setLoading(true);
    setError(null);
    try {
      if (nuevoPedido.clienteId && nuevoPedido.productos.length > 0) {
        // 1. Crear el pedido y obtener el id
         console.log('📦 Objeto de pedido a enviar al backend:', {
            idcliente: nuevoPedido.clienteId,
            monto: nuevoPedido.montoTotal // <-- Aquí ves el valor de monto/montoTotal
        });
        const pedidoCreado = await crearPedido({
          monto: nuevoPedido.montoTotal,
          idcliente: nuevoPedido.clienteId
        });
        
        const idPedido = pedidoCreado.data.id;
        console.log({idPedido})
        // 2. Agregar cada producto al pedido usando la API
        for (const p of nuevoPedido.productos) {
          await agregarProducto({
            idProducto: p.id,
            cantidad: p.cantidad,
            monto: p.subtotal,
            idPedido
          });
        }
        if (onPedidoAgregado) onPedidoAgregado();
        setNuevoPedido({ clienteId: '', productos: [], montoTotal: 0 });
        onHide();
      } else {
        setError('Debe seleccionar un cliente y al menos un producto');
      }
    } catch (error) {
      setError('Error al guardar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              value={nuevoPedido.clienteId}
              onChange={e => setNuevoPedido(prev => ({ ...prev, clienteId: e.target.value }))}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.cuit})</option>
              ))}
            </Form.Select>
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
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarPedido}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Guardar Pedido'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 