import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mostrarPago } from '../../pages/Pago';
import { mostrarPresupuesto } from '../../pages/Presupuesto';
import './DetallePago.css';

export default function DetallePago() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pago, setPago] = useState(null);
    const [presupuesto, setPresupuesto] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPago = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await mostrarPago({id});
                setPago(response.data);
                if (response.data && response.data.idPresupuesto) {
                    const presResp = await mostrarPresupuesto({id: response.data.idPresupuesto});
                    setPresupuesto(presResp.data);
                }
            } catch (error) {
                setError('No se encontró el pago');
            } finally {
                setLoading(false);
            }
        };
        cargarPago();
    }, [id]);

    if (loading) {
        return <div className="detalle-pago"><span>Cargando...</span></div>;
    }
    if (error) {
        return <div className="detalle-pago"><div className="alert alert-danger">{error}</div></div>;
    }
    if (!pago) return null;

    return (
        <div className="detalle-pago">
            <div className="header-pago">
                <h1>Detalle del Pago #{pago.id}</h1>
                <button className="btn-volver" onClick={() => navigate('/pago')}>Volver a Pagos</button>
            </div>
            <div className="info-pago">
                <p><strong>Presupuesto Asociado:</strong> #{presupuesto ? presupuesto.id : pago.idPresupuesto}</p>
                <p><strong>Fecha:</strong> {pago.createdDate ? new Date(pago.createdDate).toLocaleDateString() : ''}</p>
            </div>
        </div>
    );
} 