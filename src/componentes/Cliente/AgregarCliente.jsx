import React, { useState } from 'react';
import { crearCliente } from "../../pages/Cliente";

export default function AgregarCliente() {
    const [nombre, setNombre] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [correo, setCorreo] = useState("");
    const [cuit, setCuit] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const funciones = Cliente({}); 
        crearCliente(nombre, razonSocial, correo, cuit);

        setNombre("");
        setRazonSocial("");
        setCorreo("");
        setCuit("");
    };

    const handleChange = (e, setter) => setter(e.target.value);

    return (
        <div className="FormularioBusqueda">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nombre}
                    placeholder="Nombre y apellido del cliente"
                    onChange={(e) => handleChange(e, setNombre)}
                />
                <input
                    type="text"
                    value={razonSocial}
                    placeholder="Razón social"
                    onChange={(e) => handleChange(e, setRazonSocial)}
                />
                <input
                    type="text"
                    value={correo}
                    placeholder="Correo Electrónico"
                    onChange={(e) => handleChange(e, setCorreo)}
                />
                <input
                    type="number"
                    value={cuit}
                    placeholder="CUIT"
                    onChange={(e) => handleChange(e, setCuit)}
                />
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
}

