import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarPago.css';

export default function AgregarPago() {
    // Estado para la lista de presupuestos
    const [presupuestos, setPresupuestos] = useState([]);
    // Estado para el presupuesto seleccionado
    const [idPresupuesto, setIdPresupuesto] = useState('');
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Carga los presupuestos al montar el componente
    useEffect(() => {
        const presupuestosGuardados = localStorage.getItem('presupuestos');
        setPresupuestos(presupuestosGuardados ? JSON.parse(presupuestosGuardados) : []);
    }, []);

    // Maneja el envío del formulario para agregar un pago
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Validación simple de selección de presupuesto
        if (!idPresupuesto) {
            setError('Debe seleccionar un presupuesto');
            setLoading(false);
            return;
        }
        try {
            // Obtiene los pagos actuales y agrega el nuevo
            const pagosGuardados = localStorage.getItem('pagos');
            const pagos = pagosGuardados ? JSON.parse(pagosGuardados) : [];
            const nuevoPago = {
                id: Date.now(),
                idPresupuesto,
                createdDate: new Date().toISOString()
            };
            pagos.push(nuevoPago);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            navigate('/pago');
        } catch (error) {
            setError('Error al guardar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario-pago">
            <h2>Nuevo Pago</h2>
            {/* Muestra errores de validación o guardado */}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group">
                <label>Presupuesto:</label>
                <select
                    value={idPresupuesto}
                    onChange={e => setIdPresupuesto(e.target.value)}
                    required
                >
                    <option value="">Seleccione un presupuesto</option>
                    {presupuestos.map(p => (
                        <option key={p.id} value={p.id}>
                            #{p.id} - Pedido #{p.idPedido} - {new Date(p.createdDate).toLocaleDateString()}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Pago'}
            </button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/pago')}>Cancelar</button>
        </form>
    );
} 