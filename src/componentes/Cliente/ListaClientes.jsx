import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaClientes.css';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function ListaClientes() {
    // Estado para la lista de clientes
    const [clientes, setClientes] = useState([]);
    // Estado para mostrar loading
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Cargar clientes al montar el componente
    useEffect(() => {
        cargarClientes();
    }, []);

    // Obtiene los clientes desde localStorage
    const cargarClientes = () => {
        setLoading(true);
        setError(null);
        try {
            const guardados = localStorage.getItem('clientes');
            setClientes(guardados ? JSON.parse(guardados) : []);
        } catch (error) {
            setError('Error al cargar los clientes');
        } finally {
            setLoading(false);
        }
    };

    // Elimina un cliente por id, con confirmación
    const eliminarCliente = (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return;
        try {
            const guardados = localStorage.getItem('clientes');
            const clientesArray = guardados ? JSON.parse(guardados) : [];
            const nuevos = clientesArray.filter(c => c.id !== id);
            localStorage.setItem('clientes', JSON.stringify(nuevos));
            setClientes(nuevos);
        } catch (error) {
            setError('Error al eliminar el cliente');
        }
    };

    // Navega al detalle del cliente
    const verDetalleCliente = (id) => navigate(`/clientes/${id}`);
    // Navega a la edición del cliente
    const editarCliente = (id) => navigate(`/clientes/editar/${id}`);
    // Navega al formulario de agregar cliente
    const agregarCliente = () => navigate('/clientes/agregar');

    return (
        <div className="clientes-container">
            <div className="header-clientes">
                <h1>Clientes</h1>
                <button className="btn-agregar" onClick={agregarCliente}>
                    <FaPlus /> Agregar Cliente
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="tabla-clientes-wrapper">
                <table className="tabla-clientes">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Razón Social</th>
                            <th>Correo</th>
                            <th>CUIT</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Cargando...</td></tr>
                        ) : clientes.length === 0 ? (
                            <tr><td colSpan="5">No hay clientes registrados.</td></tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.razonSocial}</td>
                                    <td>{cliente.correo}</td>
                                    <td>{cliente.cuit}</td>
                                    <td>
                                        <button className="btn-ver" title="Ver Detalle" onClick={() => verDetalleCliente(cliente.id)}><FaEye /></button>
                                        <button className="btn-editar" title="Editar" onClick={() => editarCliente(cliente.id)}><FaEdit /></button>
                                        <button className="btn-eliminar" title="Eliminar" onClick={() => eliminarCliente(cliente.id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 