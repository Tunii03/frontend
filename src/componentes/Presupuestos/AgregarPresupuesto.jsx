import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPresupuesto } from '../../pages/Presupuesto';
import { obtenerPedidos } from '../../pages/Pedido';
import './AgregarPresupuesto.css';

export default function AgregarPresupuesto() {
    // Estado para la lista de pedidos
    const [pedidos, setPedidos] = useState([]);
    // Estado para el pedido seleccionado
    const [idPedido, setIdPedido] = useState('');
    // Estado para el estado del presupuesto (pagado/pendiente)
    const [estado, setEstado] = useState(false);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Carga los pedidos al montar el componente
    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const response = await obtenerPedidos();
                setPedidos(response.data);
            } catch (error) {
                setError('Error al cargar los pedidos');
                console.error('Error:', error);
            }
        };
        cargarPedidos();
    }, []);

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
            await crearPresupuesto({
                estado: estado,
                idpedido: idPedido
            });
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
                    {Array.isArray(pedidos) && pedidos.map(p => (
    <option key={p.id} value={p.id}>
        #{p.id} - Cliente {p.clienteId} - ${p.monto}
    </option>
))}
                </select>
            </div>
            <div className="form-group">
                <label>Estado:</label>
                <select value={estado} onChange={e => setEstado(e.target.value === 'true')} required>
                    <option value={false}>Pendiente</option>
                    <option value={true}>Pagado</option>
                </select>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Presupuesto'}
            </button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/presupuestos')}>Cancelar</button>
        </form>
    );
} 