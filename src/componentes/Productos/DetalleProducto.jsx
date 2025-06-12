import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './DetalleProducto.css';

export default function DetalleProducto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const encontrado = productos.find(p => p.id === Number(id));
        if (encontrado) setProducto(encontrado);
    }, [id]);

    if (!producto) {
        return (
            <div className="detalle-producto">
                <div className="producto-no-encontrado">
                    <h2>Producto no encontrado</h2>
                    <Button variant="primary" onClick={() => navigate('/productos')}>Volver al catálogo</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="detalle-producto">
            <div className="detalle-contenido">
                <div className="detalle-imagen">
                    <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="detalle-info">
                    <h1>{producto.nombre}</h1>
                    <p className="precio">Precio: ${producto.precio}</p>
                    <p className="stock">Stock disponible: {producto.stock}</p>
                    <div className="descripcion">
                        <h3>Descripción</h3>
                        <p>{producto.descripcion}</p>
                    </div>
                    <div className="detalle-acciones">
                        <Button variant="primary" onClick={() => navigate('/productos')}>Volver al catálogo</Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 