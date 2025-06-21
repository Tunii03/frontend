import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { crearPresupuesto } from '../../pages/Presupuesto';
import './AgregarPresupuesto.css';

// El componente ahora recibe props para controlar el modal y devolver el resultado
export default function AgregarPresupuesto({
  show,
  onHide,
  onPresupuestoAgregado,
  pedidos, // Recibe la lista de pedidos
  presupuestos // Recibe la lista de presupuestos existentes
}) {
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filtra los pedidos que ya tienen un presupuesto asociado
  const pedidosDisponibles = pedidos.filter(p => 
    !presupuestos.some(pres => pres.pedidoId === p.id)
  );

  // Limpia el estado cuando el modal se cierra
  useEffect(() => {
    if (!show) {
      setPedidoSeleccionado('');
      setError(null);
      setLoading(false);
    }
  }, [show]);
  
  const guardarPresupuesto = async () => {
    if (!pedidoSeleccionado) {
      setError('Debe seleccionar un pedido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llama a la API para crear el presupuesto
      await crearPresupuesto(pedidoSeleccionado);

      // Notifica al componente padre para que actualice la lista
      if (onPresupuestoAgregado) {
        onPresupuestoAgregado();
      }
      
      onHide(); // Cierra el modal

    } catch (err) {
      setError('Error al guardar el presupuesto. Intente de nuevo.');
      console.error('Error completo al guardar presupuesto:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Presupuesto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Pedido Asociado</Form.Label>
            <Form.Select
              value={pedidoSeleccionado}
              onChange={e => setPedidoSeleccionado(e.target.value)}
              required
              isInvalid={!!error && !pedidoSeleccionado}
            >
              <option value="">Seleccione un pedido...</option>
              {pedidosDisponibles.length > 0 ? (
                pedidosDisponibles.map(p => (
                  <option key={p.id} value={p.id}>
                    Pedido #{p.id} (Cliente: {p.cliente?.nombre || 'N/A'})
                  </option>
                ))
              ) : (
                <option disabled>No hay pedidos sin presupuesto</option>
              )}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Es necesario seleccionar un pedido.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarPresupuesto}
          disabled={loading || !pedidoSeleccionado}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Guardar Presupuesto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}