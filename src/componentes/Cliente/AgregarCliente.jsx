import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCliente } from '../../pages/Cliente';
import './AgregarCliente.css';

export default function AgregarCliente() {
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [email, setEmail] = useState("");
    const [cuit, setCuit] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Maneja el envío del formulario para agregar un cliente
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Validación simple de campos obligatorios
        if (!nombre || !razonSocial || !email || !cuit) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        try {
            await crearCliente(nombre, razonSocial, email, cuit);
            navigate('/clientes');
        } catch (error) {
            setError('Error al guardar el cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    placeholder="Ingrese el nombre del cliente"
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
                    placeholder="Ingrese la razón social"
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
                    placeholder="Ingrese el correo electrónico"
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
                    placeholder="Ingrese el CUIT"
                />
            </div>

            <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
            >
                {loading ? 'Guardando...' : 'Agregar Cliente'}
            </button>
        </form>
    );
}

