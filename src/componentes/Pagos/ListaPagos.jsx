import React, { useEffect, useState } from 'react';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { buscarPagos } from '../../pages/Pago';
import { buscarPresupuestos } from '../../pages/Presupuesto';
import AgregarPago from './AgregarPago';
import { useTitulo } from '../../context/TituloContext';
import './ListaPagos.css';

export default function ListaPagos() {
    const { setTitulo } = useTitulo();

    const [pagos, setPagos] = useState([]);
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        setTitulo('Pagos');
        cargarDatos();
    }, [setTitulo]);

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pagosRes, presupuestosRes] = await Promise.all([
                buscarPagos(),
                buscarPresupuestos()
            ]);
            setPagos(pagosRes.data);
            setPresupuestos(presupuestosRes.data);
        } catch (err) {
            setError('Error al cargar los datos. Intente recargar la página.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuardado = () => {
        setMostrarModal(false);
        cargarDatos();
    };

    return (
        <div className="pagos-container">
            <div className="header-pagos">
                <h1>Pagos</h1>
                <Button onClick={() => setMostrarModal(true)}>
                    <FaPlus /> Nuevo Pago
                </Button>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID Pago</th>
                            <th>Presupuesto Asociado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagos.length === 0 ? (
                            <tr><td colSpan="3" className="text-center">No hay pagos registrados.</td></tr>
                        ) : (
                            pagos.map(pago => {
                                const presupuestoAsociado = presupuestos.find(pres => pres.id === pago.presupuestoId);
                                return (
                                    <tr key={pago.id}>
                                        <td>{pago.id}</td>
                                        <td>Presupuesto #{pago.presupuestoId} (Pedido #{presupuestoAsociado?.pedidoId || 'N/A'})</td>
                                        <td>{pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            )}

            <AgregarPago
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                onGuardado={handleGuardado}
                presupuestos={presupuestos}
                pagos={pagos}
            />
        </div>
    );
} 