import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import './AgregarPresupuesto.css'; // O './AgregarPresupuesto.css' si creas uno nuevo
import { crearPresupuesto } from '../../pages/Presupuesto';


export default function AgregarPresupuesto({
    show, onHide, onPresupuestoAgregado, pedidosGlobal
}) {
    // Estado para el nuevo presupuesto
    const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
        estado:false,
        idPedido: '' 
    });

    // Estado para la lista de productos y pedidos

    const [pedidos, setPedidos] = useState([]); // Ahora necesitamos la lista de pedidos

    // Estado para el producto seleccionado y cantidad
   
    // Estado para errores y loading
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Actualiza productos y pedidos cuando cambian los props
    useEffect(() => {
        setPedidos(pedidosGlobal || []); // Asigna los pedidos globales
    }, [pedidosGlobal]); // Depende de productosGlobal y pedidosGlobal


    
    // Guarda el presupuesto completo
    const guardarPresupuesto = async () => {
        setLoading(true);
        setError(null);
        try {
            if (nuevoPresupuesto.pedidoId) {
                // 1. Crear el presupuesto y obtener el id
                console.log('📦 Objeto de presupuesto a enviar al backend:', {
                    pedidoId: nuevoPresupuesto.pedidoId, // Envía el ID del pedido asociado
                });
                const presupuestoCreado = await crearPresupuesto({
                    pedidoId: nuevoPresupuesto.pedidoId
                });

                const idPresupuesto = presupuestoCreado.data.id; // Asumo que la API devuelve { data: { id: ... } }
                console.log('Presupuesto creado con ID:', idPresupuesto);

    
                // 3. Crear objeto con la estructura correcta para la lista de presupuestos
                const presupuestoParaLista = {
                    id: idPresupuesto,
                    estado: false,
                    pedidoId: nuevoPresupuesto.pedidoId
                };

                if (onPresupuestoAgregado) onPresupuestoAgregado(presupuestoParaLista);
                
                // Resetear estados y cerrar modal
                setNuevoPresupuesto({ pedidoId: '', estado:false });
                onHide();
            } else {
                setError('Debe seleccionar un pedido');
            }
        } catch (error) {
            setError('Error al guardar el presupuesto.');
            console.error('Error completo al guardar presupuesto:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Presupuesto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* SELECT PARA SELECCIONAR PEDIDO EXISTENTE */}
                    <Form.Group className="mb-3">
                        <Form.Label>Pedido Asociado</Form.Label>
                        <Form.Select
                            value={nuevoPresupuesto.pedidoId}
                            onChange={e => setNuevoPresupuesto(prev => ({ ...prev, pedidoId: e.target.value }))}
                            required
                        >
                            <option value="">Seleccione un pedido</option>
                            {pedidos.map(p => (
                                <option key={p.id} value={p.id}>
                                   
                                </option>
                            ))}
                        </Form.Select>
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
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Guardar Presupuesto'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}