import React, { useEffect, useState } from 'react';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { buscarPresupuestos } from '../../pages/Presupuesto';
import { obtenerPedidos } from '../../pages/Pedido'; // Para cargar los pedidos
import AgregarPresupuesto from './AgregarPresupuesto'; // Importa el nuevo modal
import './ListaPresupuestos.css';
import { useTitulo } from '../../context/TituloContext';

export default function ListaPresupuestos() {
    const navigate = useNavigate();
    const { setTitulo } = useTitulo();

    const [presupuestos, setPresupuestos] = useState([]);
    const [pedidos, setPedidos] = useState([]); // Estado para guardar los pedidos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false); // Estado para el modal

    useEffect(() => {
        setTitulo('Presupuestos');
        cargarDatos();
    }, [setTitulo]);

    // Carga tanto presupuestos como pedidos
    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const [presupuestosRes, pedidosRes] = await Promise.all([
                buscarPresupuestos(),
                obtenerPedidos()
            ]);
            setPresupuestos(presupuestosRes.data);
            setPedidos(pedidosRes); // obtenerPedidos devuelve el array directamente
        } catch (err) {
            setError('Error al cargar los datos. Intente recargar la página.');
            console.error('Error al cargar datos de presupuestos/pedidos:', err);
        } finally {
            setLoading(false);
        }
    };

    const verDetallePresupuesto = (id) => {
        navigate(`/presupuestos/${id}`);
    };

    // Función para manejar la adición de un nuevo presupuesto desde el modal
    const handlePresupuestoAgregado = () => {
        // En lugar de añadir un objeto incompleto, simplemente
        // volvemos a cargar todos los datos desde el servidor.
        // Esto garantiza que la información siempre es correcta.
        cargarDatos();
    };

    return (
        <div className="presupuestos-container">
            <div className="header-presupuestos">
                <h1>Presupuestos</h1>
                <Button onClick={() => setMostrarModal(true)}>
                    <FaPlus /> Nuevo Presupuesto
                </Button>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pedido Asociado</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presupuestos.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No hay presupuestos registrados.</td></tr>
                        ) : (
                            presupuestos.map(p => {
                                // Buscamos el cliente en la lista de pedidos
                                const pedidoAsociado = pedidos.find(ped => ped.id === p.pedidoId);
                                return (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>Pedido #{p.pedidoId} (Cliente: {pedidoAsociado?.cliente?.nombre || 'N/A'})</td>
                                        <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>{p.estado ? 'Pagado' : 'Pendiente'}</td>
                                        <td>
                                            <Button variant="info" size="sm" title="Ver Detalle" onClick={() => verDetallePresupuesto(p.id)}>
                                                <FaEye />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            )}

            {/* Renderiza el Modal */}
            <AgregarPresupuesto
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                pedidos={pedidos}
                presupuestos={presupuestos}
                onPresupuestoAgregado={handlePresupuestoAgregado}
            />
        </div>
    );
} 