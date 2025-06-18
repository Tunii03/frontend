import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AgregarCliente from './AgregarCliente';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import clienteEjemplo from './cliente.json';
import './DetalleCliente.css';


export default function DetalleCliente() {
    const [clientes, setClientes] = useState( () => {
        const guardados = localStorage.getItem('cliente');
        if (guardados) {
            const arr = JSON.parse(guardados);
            if (Array.isArray(arr) && arr.length > 0) return arr;
        }
        localStorage.setItem('cliente', JSON.stringify(clienteEjemplo));
        return clienteEjemplo;
        });
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        razonSocial: '',
        correo: '',
        cuit: ''
    });

    useEffect(() => {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }, [clientes]);

    const AgregarNuevoCliente = (nuevo) => {
        setClientes([...clientes, { ...nuevo, id: Date.now() }]);
        setMostrarModal(false);
    };

    const eliminarCliente = (e, id) => {
        e.stopPropagation();
        setClientes(clientes.filter(c => c.id !== id));
    };

    const comenzarEdicion = (cliente) => {
        setEditando(cliente.id);
        setFormData({
            nombre: cliente.nombre,
            razonSocial: cliente.razonSocial,
            correo: cliente.correo,
            cuit: cliente.cuit
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const confirmarEdicion = (e) => {
        e.preventDefault();
        actualizarCliente({ id: editando, ...formData });
        setClientes(clientes.map(c =>
            c.id === editando ? { ...c, ...formData } : c
        ));
        setEditando(null);
    };


    return (
        <div className="lista-clientes">
            <div className="header-clientes">
                <div className="titulo-clientes">
                    <h1>Clientes</h1>
                    <Button variant="outline-dark" onClick={() => setMostrarModal(true)} title="Agregar cliente">
                        <FaPlus size={32} />
                    </Button>
                </div>
            </div>

            <div className="catalogo-clientes">
                {clientes.length === 0 ? (
                    <p className="no-clientes">No hay clientes disponibles</p>
                ) : (
                    clientes.map((c) => (
                        <div key={c.id} className="cliente-item">
                            <button
                                className="btn-eliminar-cliente"
                                title="Eliminar cliente"
                                onClick={e => eliminarCliente(e, c.id)}
                            >
                                <FaTrash />
                            </button>
                            <div className="cliente-info">
                                {editando === c.id ? (
                                    <form onSubmit={confirmarEdicion} className="form-edicion">
                                        <input name="nombre" value={formData.nombre} onChange={handleChange} />
                                        <input name="razonSocial" value={formData.razonSocial} onChange={handleChange} />
                                        <input name="correo" value={formData.correo} onChange={handleChange} />
                                        <input name="cuit" value={formData.cuit} onChange={handleChange} />
                                        <button type="submit">Guardar</button>
                                        <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
                                    </form>
                                ) : (
                                    <>
                                        <strong>{c.nombre}</strong>
                                        <p>Razón Social: {c.razonSocial}</p>
                                        <p>Correo: {c.correo}</p>
                                        <p>CUIT: {c.cuit}</p>
                                        <button className="btn-editar-cliente" onClick={() => comenzarEdicion(c)}>
                                            Editar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AgregarCliente onClienteAgregado={AgregarNuevoCliente} />
                </Modal.Body>
            </Modal>
        </div>
    );
}