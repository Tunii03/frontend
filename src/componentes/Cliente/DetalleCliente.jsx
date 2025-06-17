import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalleCliente.css';

export default function DetalleCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Estado para el cliente actual
    const [cliente, setCliente] = useState(null);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(true);

    // Carga el cliente al montar o cambiar el id
    useEffect(() => {
        cargarCliente();
        // eslint-disable-next-line
    }, [id]);

    // Busca el cliente por id en localStorage
    const cargarCliente = () => {
        setLoading(true);
        setError(null);
        try {
            const guardados = localStorage.getItem('clientes');
            const clientes = guardados ? JSON.parse(guardados) : [];
            const encontrado = clientes.find(c => String(c.id) === String(id));
            if (encontrado) {
                setCliente(encontrado);
            } else {
                setError('No se encontró el cliente');
            }
        } catch (error) {
            setError('Error al cargar el cliente');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        // Muestra un mensaje de carga
        return (
            <div className="detalle-cliente">
                <div className="text-center">
                    <span>Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        // Muestra errores y un botón para volver
        return (
            <div className="detalle-cliente">
                <div className="info-cliente">
                    <div className="alert alert-danger">{error}</div>
                    <button className="btn-volver" onClick={() => navigate('/clientes')}>Volver a Clientes</button>
                </div>
            </div>
        );
    }

    if (!cliente) return null;

    return (
        <div className="detalle-cliente">
            <div className="header-cliente">
                <h1>Detalle del Cliente</h1>
                <button className="btn-volver" onClick={() => navigate('/clientes')}>Volver a Clientes</button>
            </div>
            <div className="info-cliente">
                <h3>{cliente.nombre}</h3>
                <p><strong>Razón Social:</strong> {cliente.razonSocial}</p>
                <p><strong>Correo:</strong> {cliente.correo}</p>
                <p><strong>CUIT:</strong> {cliente.cuit}</p>
            </div>
        </div>
    );
}