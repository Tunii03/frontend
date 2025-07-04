import React, { useState } from 'react';
import './AgregarProducto.css';
import { crearProducto } from '../../pages/Producto.js';

export default function AgregarProducto({ onProductoAgregado }) {
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState(0);
    const [stock, setStock] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState('');
    const [errorImagen, setErrorImagen] = useState('');

    // Maneja la carga y validación de la imagen
    const handleImagen = (e) => {
        const file = e.target.files[0];
        setErrorImagen('');
        if (file) {
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                setErrorImagen('Solo JPG o PNG');
                setImagen(null);
                setImagenPreview('');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrorImagen('Máx. 5MB');
                setImagen(null);
                setImagenPreview('');
                return;
            }
            setImagen(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagenPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Maneja el envío del formulario para agregar un producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            await crearProducto(nombre,stock,descripcion,precio);
            
            // Solo llamar onProductoAgregado después de que se complete exitosamente la creación
            onProductoAgregado({
                nombre,
                precio: Number(precio),
                stock: Number(stock),
                descripcion,
                imagen: imagenPreview
            });
            
            if (imagenPreview) {
                const clave = `imagen_producto_${Date.now()}`;
                localStorage.setItem(clave, imagenPreview);
            }
            
            // Limpiar el formulario
            setNombre('');
            setPrecio(0);
            setStock(0);
            setDescripcion('');
            setImagen(null);
            setImagenPreview('');
            setErrorImagen('');
        }
        catch (error){
            console.log(error)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario-producto">
            <div className="form-group">
                <label>Nombre:
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
                </label>
            </div>
            <div className="form-group">
                <label>Precio:
                    <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} required min="0" />
                </label>
            </div>
            <div className="form-group">
                <label>Stock:
                    <input type="number" value={stock} onChange={e => setStock(e.target.value)} required min="0" />
                </label>
            </div>
            <div className="form-group">
                <label>Descripción:
                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                </label>
            </div>
            <div className="form-group">
                <label>Imagen (JPG o PNG, máx. 5MB):
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImagen} className="input-imagen" />
                </label>
                {errorImagen && <span className="error-mensaje">{errorImagen}</span>}
                {imagenPreview && (
                    <div className="imagen-preview">
                        <img src={imagenPreview} alt="Vista previa" />
                    </div>
                )}
            </div>
            <button type="submit" className="btn-submit">Agregar Producto</button>
        </form>
    );
}