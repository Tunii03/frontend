import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye } from 'react-icons/fa';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { buscarPresupuestos } from '../../pages/Presupuesto';
import './ListaPresupuestos.css';
import { useTitulo } from '../../context/TituloContext';
import AgregarPresupuesto from './AgregarPresupuesto';

export default function ListaPresupuestos() {
    // Estado para la lista de presupuestos
    const [presupuestos, setPresupuestos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    // Estado para loading
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { titulo, setTitulo } = useTitulo();

    // Carga los presupuestos al montar el componente
    useEffect(() => {
        setTitulo('Presupuestos');
        cargarPedidos();
        cargarPresupuestos();
    }, []);


    const cargarPedidos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerPedidos();
            setPedidos(data);
        } catch (error) {
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };
    // Obtiene los presupuestos desde la API
    const cargarPresupuestos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await buscarPresupuestos();
            setPresupuestos(response.data);
        } catch (error) {
            setError('Error al cargar los presupuestos');
        } finally {
            setLoading(false);
        }
    };

    // Navega al detalle del presupuesto
    const verDetallePresupuesto = (id) => {
        navigate(`/presupuestos/${id}`);
    };


    return (
        <div className="presupuestos-container">
            <div className="header-presupuestos">
                <h1>{titulo}</h1>
                <Button variant="primary" onClick={() => setMostrarModal(true)}>
                    <FaPlus /> Nuevo Presupuesto
                </Button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="tabla-presupuestos-wrapper">
                <table className="tabla-presupuestos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pedido</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Cargando...</td></tr>
                        ) : presupuestos.length === 0 ? (
                            <tr><td colSpan="5">No hay presupuestos registrados.</td></tr>
                        ) : (
                            presupuestos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.pedidoId || p.idPedido}</td>
                                    <td>{p.createdDate ? new Date(p.createdDate).toLocaleDateString() : ''}</td>
                                    <td>{p.estado ? 'Pagado' : 'Pendiente'}</td>
                                    <td>
                                        <button className="btn-ver" title="Ver Detalle" onClick={() => verDetallePresupuesto(p.id)}><FaEye /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <AgregarPresupuesto
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                onPresupuestoAgregado={(nuevo) => {
                    setPresupuestos(prev => [...prev,nuevo])
                }}
                pedidosGlobal={pedidos}
            ></AgregarPresupuesto>
        </div>
    );
} 