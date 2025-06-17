import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarProducto from './AgregarProducto';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import './ListaProductos.css';

export default function ListaProductos() {
    // Estado para la lista de productos
    const [productos, setProductos] = useState(() => {
        const guardados = localStorage.getItem('productos');
        if (guardados) {
            const arr = JSON.parse(guardados);
            if (Array.isArray(arr) && arr.length > 0) return arr;
        }
        return [];
    });
    // Estado para mostrar el modal de agregar producto
    const [mostrarModal, setMostrarModal] = useState(false);
    // Estado para la búsqueda
    const [busqueda, setBusqueda] = useState('');
    const navigate = useNavigate();

    // Actualiza localStorage cuando cambia la lista de productos
    useEffect(() => {
        localStorage.setItem('productos', JSON.stringify(productos));
    }, [productos]);

    // Agrega un nuevo producto a la lista
    const agregarProducto = (nuevo) => {
        setProductos([...productos, { ...nuevo, id: Date.now() }]);
        setMostrarModal(false);
    };

    // Elimina un producto por id
    const eliminarProducto = (e, id) => {
        e.stopPropagation();
        setProductos(productos.filter(p => p.id !== id));
    };

    // Navega al detalle del producto
    const verDetalle = (id) => {
        navigate(`/productos/${id}`);
    };

    // Filtra productos por nombre según la búsqueda
    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="lista-productos">
            <div className="header-productos">
                <div className="titulo-productos">
                    <h1>Catálogo de Productos</h1>
                    <Button className="btn-mas" variant="outline-dark" onClick={() => setMostrarModal(true)} title="Agregar producto">
                        <FaPlus size={24} />
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
                {productosFiltrados.length === 0 ? (
                    <p className="no-productos">No hay productos en el catálogo</p>
                ) : (
                    productosFiltrados.map((p) => (
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