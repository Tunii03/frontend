import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import './ListaPedidos.css';
import { obtenerPedido, actualizarPedido } from '../../pages/Pedido';

export default function EditarPedido() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [montoTotal, setMontoTotal] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const pedidoEncontrado = await obtenerPedido(id);
            if (pedidoEncontrado) {
                setPedido(pedidoEncontrado);
                setMontoTotal(pedidoEncontrado.monto || 0);
            } else {
                setError('No se encontró el pedido');
            }
        } catch (error) {
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await actualizarPedido({
                id,
                monto: montoTotal
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

    if (!pedido) {
        return <div className="formulario"><div className="alert alert-danger">No se encontró el pedido</div></div>;
    }

    return (
        <form onSubmit={handleGuardar} className="formulario">
            <h2>Editar Pedido #{pedido.id}</h2>
            
            <div className="form-group">
                <label><strong>Cliente:</strong></label>
                <Form.Control
                    type="text"
                    value={pedido.cliente ? `${pedido.cliente.nombre} (${pedido.cliente.cuit})` : `Cliente ID: ${pedido.clienteId}`}
                    readOnly
                    className="form-control-plaintext"
                />
            </div>

            <div className="form-group">
                <label><strong>Fecha de Creación:</strong></label>
                <Form.Control
                    type="text"
                    value={pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : new Date(pedido.createdAt).toLocaleDateString()}
                    readOnly
                    className="form-control-plaintext"
                />
            </div>

            <div className="form-group">
                <label><strong>Monto Total:</strong></label>
                <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={montoTotal}
                    onChange={e => setMontoTotal(Number(e.target.value))}
                    required
                />
                <small className="form-text text-muted">
                    Solo puedes modificar el monto total del pedido.
                </small>
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