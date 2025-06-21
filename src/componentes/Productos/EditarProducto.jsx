import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ListaProductos.css';
import { mostrarProducto, actualizarProducto } from '../../pages/Producto';

export default function EditarProducto() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carga el producto al montar o cambiar el id
    useEffect(() => {
        cargarProducto();
    }, [id]);

   
    const cargarProducto = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mostrarProducto({ id });
            const producto = response.data;
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

    // Maneja el envío del formulario para editar el producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Validación simple de campos obligatorios
        if (!nombre || !stock || !descripcion || !precio) {
            setError('Todos los campos son obligatorios');
            return;
        }
        
        console.log('Intentando actualizar producto:', { id, nombre, stock, descripcion, precio });
        
        try {
            const response = await actualizarProducto({
                id,
                nombre,
                stock: Number(stock),
                descripcion,
                precio: Number(precio)
            });
            console.log('Producto actualizado exitosamente:', response);
            navigate('/productos');
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            setError('Error al guardar los cambios');
        }
    };

    if (loading) {
        // Muestra un mensaje de carga
        return <div className="formulario"><span>Cargando...</span></div>;
    }

    if (error) {
        // Muestra errores y un mensaje
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