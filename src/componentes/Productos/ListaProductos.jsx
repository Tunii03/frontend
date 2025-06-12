import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarProducto from './AgregarProducto';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import productosEjemplo from './productos.json';
import './ListaProductos.css';

export default function ListaProductos() {
    const [productos, setProductos] = useState(() => {
        const guardados = localStorage.getItem('productos');
        if (guardados) {
            const arr = JSON.parse(guardados);
            if (Array.isArray(arr) && arr.length > 0) return arr;
        }
        localStorage.setItem('productos', JSON.stringify(productosEjemplo));
        return productosEjemplo;
    });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('productos', JSON.stringify(productos));
    }, [productos]);

    const agregarProducto = (nuevo) => {
        setProductos([...productos, { ...nuevo, id: Date.now() }]);
        setMostrarModal(false);
    };

    const eliminarProducto = (e, id) => {
        e.stopPropagation();
        setProductos(productos.filter(p => p.id !== id));
    };

    const verDetalle = (id) => {
        navigate(`/productos/${id}`);
    };

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="lista-productos">
            <div className="header-productos">
                <div className="titulo-productos">
                    <h1>Productos. Anotacion: donde guardar imagen en la base de datos</h1>
                    <Button className="btn-mas" variant="outline-dark" onClick={() => setMostrarModal(true)} title="Agregar producto">
                        <FaPlus size={32} />
                    </Button>
                </div>
                <div className="busqueda-productos">
                    <input
                        type="text"
                        placeholder="Ingrese el Producto"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                    <FaSearch className="icono-busqueda" />
                </div>
            </div>
            <div className="catalogo-productos">
                {filtrados.length === 0 ? (
                    <p className="no-productos">No hay productos en el catálogo</p>
                ) : (
                    filtrados.map((p) => (
                        <div
                            key={p.id}
                            className="producto-item"
                            onClick={() => verDetalle(p.id)}
                        >
                            <button
                                className="btn-eliminar-prueba"
                                title="Eliminar producto"
                                onClick={e => eliminarProducto(e, p.id)}
                            >
                                <FaTrash />
                            </button>
                            <div className="producto-imagen-placeholder">
                                <img src={p.imagen} alt={p.nombre} />
                            </div>
                            <div className="producto-info">
                                <strong>{p.nombre}</strong>
                                <div className="stock">Stock: {p.stock > 0 ? p.stock : 'Sin Stock'}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AgregarProducto onProductoAgregado={agregarProducto} />
                </Modal.Body>
            </Modal>
        </div>
    );
}