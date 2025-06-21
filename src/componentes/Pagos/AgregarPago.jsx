import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { crearPago } from '../../pages/Pago';
import './AgregarPago.css';

export default function AgregarPago({ show, onHide, onGuardado, presupuestos, pagos }) {
    
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Filtra los presupuestos que ya tienen un pago asociado
    const presupuestosDisponibles = presupuestos.filter(pres =>
        !pagos.some(pago => pago.presupuestoId === pres.id)
    );

    // Limpia el estado cuando el modal se cierra
    useEffect(() => {
        if (!show) {
            setPresupuestoSeleccionado('');
            setError(null);
        }
    }, [show]);

    const handleGuardar = async () => {
        if (!presupuestoSeleccionado) {
            setError('Debe seleccionar un presupuesto.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await crearPago(presupuestoSeleccionado);
            onGuardado();
        } catch (err) {
            setError('Error al registrar el pago.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3">
                    <Form.Label>Presupuesto a Pagar</Form.Label>
                    <Form.Select
                        value={presupuestoSeleccionado}
                        onChange={e => setPresupuestoSeleccionado(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un presupuesto...</option>
                        {presupuestosDisponibles.length > 0 ? (
                            presupuestosDisponibles.map(pres => (
                                <option key={pres.id} value={pres.id}>
                                    Presupuesto #{pres.id} (Pedido #{pres.pedidoId})
                                </option>
                            ))
                        ) : (
                            <option disabled>No hay presupuestos pendientes de pago</option>
                        )}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" onClick={handleGuardar} disabled={loading || !presupuestoSeleccionado}>
                    {loading ? <Spinner size="sm" /> : 'Registrar Pago'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
} 