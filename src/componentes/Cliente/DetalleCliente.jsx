import React, { useState, useEffect } from "react";
import { crearCliente, mostrarClientes, actualizarCliente, borrarCliente } from "../../pages/Cliente";
export default function DetalleCliente() {
    const [clientes, setClientes] = useState([]);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        razonSocial: "",
        correo: "",
        cuit: ""
    });

    useEffect(() => {
        mostrarClientes()
            .then(response => setClientes(response.data))
            .catch(error => console.error("Error al obtener clientes:", error));
    }, []);

    const eliminarCliente = (e, id) => {
        e.stopPropagation();
        borrarCliente({ id });
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
        <div className="detalle-cliente">
            {clientes.map((c) => (
                <div key={c.id} className="cliente">
                    <button
                        className="EliminarCliente"
                        title="Eliminar Cliente"
                        onClick={e => eliminarCliente(e, c.id)} >
                        Eliminar
                    </button>
                    <button
                        className="EditarCliente"
                        title="Editar Cliente"
                        onClick={() => comenzarEdicion(c)} >
                        Editar
                    </button>
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
                        <div className="InfoCliente">
                            <p>Nombre: {c.nombre}</p>
                            <p>Razón social: {c.razonSocial}</p>
                            <p>Correo electrónico: {c.correo}</p>
                            <p>CUIT: {c.cuit}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
