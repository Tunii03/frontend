import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPresupuesto, buscarPresupuestos } from '../../pages/Presupuesto';
import { obtenerPedidos } from '../../pages/Pedido';
import './AgregarPresupuesto.css';

export default function AgregarPresupuesto() {
    // Estado para la lista de pedidos
    const [pedidos, setPedidos] = useState([]);
    // Estado para la lista de presupuestos existentes
    const [presupuestos, setPresupuestos] = useState([]);
    // Estado para el pedido seleccionado
    const [idPedido, setIdPedido] = useState('');
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Carga los pedidos y presupuestos al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargar pedidos
                const pedidosData = await obtenerPedidos();  
                console.log("Pedidos desde front:", pedidosData);
                setPedidos(pedidosData);

                // Cargar presupuestos existentes
                const presupuestosResponse = await buscarPresupuestos();
                const presupuestosData = presupuestosResponse.data;
                console.log("Presupuestos existentes:", presupuestosData);
                setPresupuestos(presupuestosData);
            } catch (error) {
                setError('Error al cargar los datos');
                console.error('Error:', error);
            }
        };
        cargarDatos();
    }, []);

    // Filtra los pedidos que ya tienen presupuesto
    const pedidosDisponibles = pedidos.filter(pedido => {
        return !presupuestos.some(presupuesto => presupuesto.pedidoId === pedido.id);
    });

    // Maneja el envío del formulario para agregar un presupuesto
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Validación simple de selección de pedido
        if (!idPedido) {
            setError('Debe seleccionar un pedido');
            setLoading(false);
            return;
        }
        try {
            // El estado siempre será false (pendiente) automáticamente
            await crearPresupuesto(idPedido, false);
            navigate('/presupuestos');
        } catch (error) {
            setError('Error al guardar el presupuesto');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario-presupuesto">
            <h2>Nuevo Presupuesto</h2>
            {/* Muestra errores de validación o guardado */}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group">
                <label>Pedido:</label>
                <select
                    value={idPedido}
                    onChange={e => setIdPedido(e.target.value)}
                    required
                >
                    <option value="">Seleccione un pedido</option>
                    {Array.isArray(pedidosDisponibles) && pedidosDisponibles.length > 0 ? (
                        pedidosDisponibles.map(p => (
                            <option 
                            key={p.id} 
                            value={p.id}>
                                #{p.id} - 
                                Cliente 
                                {p.clienteId} - 
                                ${p.monto}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No hay pedidos disponibles para presupuesto</option>
                    )}
                </select>
                {pedidosDisponibles.length === 0 && pedidos.length > 0 && (
                    <small className="form-text" style={{color: '#dc3545'}}>
                        Todos los pedidos ya tienen presupuesto asociado
                    </small>
                )}
            </div>
            <div className="form-group">
                <label>Estado:</label>
                <input 
                    type="text" 
                    value="Pendiente" 
                    disabled 
                    className="estado-disabled"
                />
                <small className="form-text">El estado se establece automáticamente como "Pendiente"</small>
            </div>
            <button type="submit" className="btn-submit" disabled={loading || pedidosDisponibles.length === 0}>
                {loading ? 'Guardando...' : 'Crear Presupuesto'}
            </button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/presupuestos')}>Cancelar</button>
        </form>
    );
} 