import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarProducto from './AgregarProducto';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import './ListaProductos.css';
import { buscarProductos, borrarProducto } from '../../pages/Producto';
import { useTitulo } from '../../context/TituloContext';

export default function ListaProductos() {
    // Estado para la lista de productos
    const [productos, setProductos] = useState([]);
    // Estado para mostrar el modal de agregar producto
    const [mostrarModal, setMostrarModal] = useState(false);
    // Estado para la búsqueda
    const [busqueda, setBusqueda] = useState('');
    const navigate = useNavigate();
    const { titulo, setTitulo } = useTitulo();

    // Carga los productos desde la API al montar
    useEffect(() => {
        setTitulo('Productos');
        cargarProductos();
    }, [setTitulo]);

    const cargarProductos = async () => {
        try {
            const response = await buscarProductos();
            setProductos(response.data);
        } catch (error) {
            setProductos([]);
        }
    };

    // Agrega un nuevo producto a la lista (recarga desde la API)
    const agregarProducto = () => {
        setMostrarModal(false);
        cargarProductos();
    };

    // Elimina un producto por id usando la API
    const eliminarProducto = async (e, id) => {
        e.stopPropagation();
        try {
            await borrarProducto({ id });
            setProductos(productos.filter(p => p.id !== id));
        } catch (error) {
            // Manejo de error opcional
        }
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
                    <h1>{titulo}</h1>
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