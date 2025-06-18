import React, { useState } from 'react';
import { crearCliente } from "../../pages/Cliente";
import './AgregarCliente.css';

export default function AgregarCliente({ onClienteAgregado }) {
    const [nombre, setNombre] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [correo, setCorreo] = useState("");
    const [cuit, setCuit] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        onClienteAgregado({
            nombre,
            razonSocial,
            correo,
            cuit: Number(cuit),
        });
        try{
            await crearProducto(nombre,razonSocial, correo, cuit);
        }
        catch (error){
            console.log(error)
        }
        setNombre('');
        setRazonSocial('');
        setCorreo('');
        setCuit("");
    };

    return (
        <form onSubmit={handleSubmit} className="formulario">
            <div className="form-group">
                <label>Nombre:
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
                </label>
            </div>
            <div className="form-group">
                <label>Razón social:
                    <input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} required />
                </label>
            </div>
            <div className="form-group">
                <label>Correo electrónico:
                    <input type="text" value={correo} onChange={e => setCorreo(e.target.value)} required />
                </label>
            </div>
            <div className="form-group">
                <label>CUIT:
                    <input type="number" value={cuit} onChange={e => setCuit(e.target.value)} required />
                </label>
            </div>
            <button type="submit" className="btn-submit">Agregar Cliente</button>
        </form>
    );
}

