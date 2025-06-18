import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarCliente.css';
import { mostrarClientes, actualizarCliente } from '../../pages/Cliente';

export default function EditarCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [correo, setCorreo] = useState("");
    const [cuit, setCuit] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carga los datos del cliente al montar o cambiar el id
    useEffect(() => {
        cargarCliente();
    }, [id]);

    const cargarCliente = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mostrarClientes({ id });
            const cliente = response.data;
            if (cliente) {
                setNombre(cliente.nombre);
                setRazonSocial(cliente.razonSocial);
                setCorreo(cliente.correo);
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

    // Maneja el envío del formulario para editar el cliente
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Validación simple de campos obligatorios
        if (!nombre || !razonSocial || !correo || !cuit) {
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            await actualizarCliente({
                id,
                nombre,
                razonSocial,
                correo,
                cuit: Number(cuit)
            });
            navigate('/clientes');
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
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
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
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/clientes')}>Cancelar</button>
        </form>
    );
} 