import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mostrarPresupuesto, actualizarPresupuesto } from '../../pages/Presupuesto';
import './EditarPresupuesto.css';

export default function EditarPresupuesto() {
    const { id } = useParams();
    const [monto, setMonto] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const presupuesto = await mostrarPresupuesto({ id });
                setMonto(presupuesto.monto);
            } catch (error) {
                setError('Error al cargar el presupuesto');
            }
        };
        obtenerPresupuesto();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await actualizarPresupuesto({ id, monto });
            navigate('/presupuestos');
        } catch (error) {
            setError('Error al actualizar el presupuesto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario-presupuesto">
            <h2>Editar Presupuesto</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group">
                <label>Monto:</label>
                <input
                    type="number"
                    value={monto}
                    onChange={e => setMonto(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/presupuestos')}>Cancelar</button>
        </form>
    );
} 