import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { buscarClientes, borrarCliente } from '../../pages/Cliente';
import { useTitulo } from '../../context/TituloContext';
import './ListaClientes.css';

export default function ListaClientes() {
    const { titulo, setTitulo } = useTitulo();
    const navigate = useNavigate();
    
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTitulo('Clientes');
        cargarClientes();
    }, [setTitulo]);

    const cargarClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await buscarClientes();
            setClientes(response.data);
            console.log('Clientes cargados correctamente');
        } catch (error) {
            setError('Error al cargar los clientes');
        } finally {
            setLoading(false);
        }
    };

    // Elimina un cliente por id, con confirmación y usando la API
    const eliminarCliente = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return;
        try {
            await borrarCliente({ id });
            setClientes(clientes.filter(c => c.id !== id));
            console.log('Cliente eliminado correctamente');
        } catch (error) {
            setError('Error al eliminar el cliente');
        }
    };

    // Navega a la edición del cliente
    const editarCliente = (id) => navigate(`/clientes/editar/${id}`);
    // Navega al formulario de agregar cliente
    const agregarCliente = () => navigate('/clientes/agregar');

    return (
        <div className="clientes-container">
            <div className="header-clientes">
                <h1>{titulo}</h1>
                <button className="btn-agregar" onClick={agregarCliente}>
                    <FaPlus /> Nuevo Cliente
                </button>
            </div>
            
            {error && (
                <Alert variant="danger" className="mb-3">
                    {error}
                </Alert>
            )}
            
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover className="tabla-clientes">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Razón Social</th>
                            <th>Email</th>
                            <th>CUIT</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 ? (
                            <tr><td colSpan="6">No hay clientes registrados.</td></tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.razonSocial}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.cuit}</td>
                                    <td>
                                        <button className="btn-editar" title="Editar" onClick={() => editarCliente(cliente.id)}><FaEdit /></button>
                                        <button className="btn-eliminar" title="Eliminar" onClick={() => eliminarCliente(cliente.id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
} 