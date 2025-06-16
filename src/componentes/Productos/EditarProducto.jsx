import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ListaProductos.css';

export default function EditarProducto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarProducto();
        // eslint-disable-next-line
    }, [id]);

    const cargarProducto = () => {
        setLoading(true);
        setError(null);
        try {
            const guardados = localStorage.getItem('productos');
            const productos = guardados ? JSON.parse(guardados) : [];
            const producto = productos.find(p => String(p.id) === String(id));
            if (producto) {
                setNombre(producto.nombre);
                setStock(producto.stock);
                setDescripcion(producto.descripcion);
                setPrecio(producto.precio);
            } else {
                setError('No se encontró el producto');
            }
        } catch (error) {
            setError('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (!nombre || !stock || !descripcion || !precio) {
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            const guardados = localStorage.getItem('productos');
            let productos = guardados ? JSON.parse(guardados) : [];
            productos = productos.map(p =>
                String(p.id) === String(id)
                    ? { ...p, nombre, stock: Number(stock), descripcion, precio: Number(precio) }
                    : p
            );
            localStorage.setItem('productos', JSON.stringify(productos));
            navigate('/productos');
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
            <h2>Editar Producto</h2>
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
                <label htmlFor="stock">Stock:</label>
                <input
                    type="number"
                    id="stock"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="descripcion">Descripción:</label>
                <input
                    type="text"
                    id="descripcion"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="precio">Precio:</label>
                <input
                    type="number"
                    id="precio"
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn-submit">Guardar Cambios</button>
            <button type="button" className="btn-submit" style={{background:'#6c757d',marginTop:'10px'}} onClick={()=>navigate('/productos')}>Cancelar</button>
        </form>
    );
} 