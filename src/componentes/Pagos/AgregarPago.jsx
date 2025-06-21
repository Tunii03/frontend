import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPago, buscarPagos } from '../../pages/Pago';
import { buscarPresupuestos } from '../../pages/Presupuesto';
import './AgregarPago.css';

export default function AgregarPago() {
    // Estado para la lista de presupuestos
    const [presupuestos, setPresupuestos] = useState([]);
    // Estado para la lista de pagos existentes
    const [pagos, setPagos] = useState([]);
    // Estado para el presupuesto seleccionado
    const [idPresupuesto, setIdPresupuesto] = useState('');
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Carga los presupuestos y pagos al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const [presupuestosResp, pagosResp] = await Promise.all([
                    buscarPresupuestos(),
                    buscarPagos()
                ]);
                setPresupuestos(presupuestosResp.data);
                setPagos(pagosResp.data);
            } catch (error) {
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // Filtra presupuestos que no tienen pagos asociados
    const presupuestosDisponibles = presupuestos.filter(presupuesto => {
        // Devuelve `true` si NO se encuentra ningún pago para este presupuesto
        return !pagos.some(pago => pago.presupuestoId === presupuesto.id);
    });

    // Maneja el envío del formulario para agregar un pago
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        if (!idPresupuesto) {
            setError('Debe seleccionar un presupuesto');
            setLoading(false);
            return;
        }
        
        try {
            await crearPago(idPresupuesto);
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
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group">
                <label>Presupuesto:</label>
                <select
                    value={idPresupuesto}
                    onChange={e => setIdPresupuesto(e.target.value)}
                    required
                >
                    <option value="">Seleccione un presupuesto</option>
                    {loading ? (
                        <option disabled>Cargando presupuestos...</option>
                    ) : presupuestosDisponibles.length > 0 ? (
                        presupuestosDisponibles.map(p => (
                            <option key={p.id} value={p.id}>
                                Presupuesto #{p.id} - Pedido #{p.pedidoId}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay presupuestos pendientes de pago</option>
                    )}
                </select>
                {!loading && presupuestos.length > 0 && presupuestosDisponibles.length === 0 && (
                    <small className="form-text" style={{ color: '#6c757d', marginTop: '5px' }}>
                        Todos los presupuestos ya han sido pagados.
                    </small>
                )}
            </div>
            <button type="submit" className="btn-submit" disabled={loading || presupuestosDisponibles.length === 0}>
                {loading ? 'Guardando...' : 'Crear Pago'}
            </button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/pago')}>Cancelar</button>
        </form>
    );
} 