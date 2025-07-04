import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarCliente.css';
import { mostrarClientes, actualizarCliente } from '../../pages/Cliente';

export default function EditarCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [email, setEmail] = useState("");
    const [cuit, setCuit] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCliente();
    }, [id]);

    const cargarCliente = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mostrarClientes(id);
            const cliente = response.data;
            if (cliente) {
                setNombre(cliente.nombre);
                setRazonSocial(cliente.razonSocial);
                setEmail(cliente.email);
                setCuit(cliente.cuit);
            } else {
                setError('No se encontró el cliente');
            }
        } catch (error) {
            setError('Error al cargar el cliente');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!nombre || !razonSocial || !email || !cuit) {
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            await actualizarCliente({
                id,
                nombre,
                razonSocial,
                email,
                cuit: Number(cuit)
            });
            navigate('/clientes');
            console.log('Cliente actualizado correctamente');
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

    return (
        <form onSubmit={handleSubmit} className="formulario">
            <h2>Editar Cliente</h2>
            <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="razonSocial">Razón social:</label>
                <input
                    type="text"
                    id="razonSocial"
                    value={razonSocial}
                    onChange={e => setRazonSocial(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="correo">Correo electrónico:</label>
                <input
                    type="email"
                    id="correo"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cuit">CUIT:</label>
                <input
                    type="number"
                    id="cuit"
                    value={cuit}
                    onChange={e => setCuit(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn-submit">Guardar Cambios</button>
            
        </form>
    );
} 