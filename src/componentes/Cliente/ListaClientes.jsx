import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaClientes.css';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargarClientes();
    }, []);

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

    const handleEliminar = (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
            try {
                const guardados = localStorage.getItem('clientes');
                const clientesArray = guardados ? JSON.parse(guardados) : [];
                const nuevos = clientesArray.filter(c => c.id !== id);
                localStorage.setItem('clientes', JSON.stringify(nuevos));
                setClientes(nuevos);
            } catch (error) {
                setError('Error al eliminar el cliente');
            }
        }
    };

    const handleVerDetalle = (id) => {
        navigate(`/clientes/${id}`);
    };

    const handleEditar = (id) => {
        navigate(`/clientes/editar/${id}`);
    };

    return (
        <div className="clientes-container">
            <div className="header-clientes">
                <h1>Clientes</h1>
                <button className="btn-agregar" onClick={() => navigate('/clientes/agregar')}>
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
                                        <button className="btn-ver" title="Ver Detalle" onClick={() => handleVerDetalle(cliente.id)}><FaEye /></button>
                                        <button className="btn-editar" title="Editar" onClick={() => handleEditar(cliente.id)}><FaEdit /></button>
                                        <button className="btn-eliminar" title="Eliminar" onClick={() => handleEliminar(cliente.id)}><FaTrash /></button>
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