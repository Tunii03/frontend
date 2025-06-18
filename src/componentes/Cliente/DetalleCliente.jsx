<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AgregarCliente from './AgregarCliente';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import clienteEjemplo from './cliente.json';
import './DetalleCliente.css';

=======
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalleCliente.css';
import { mostrarClientes } from '../../pages/Cliente';
>>>>>>> a6009bd2f6a8a4016664ecb85c07dd65cb89d8c1

export default function DetalleCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Estado para el cliente actual
    const [cliente, setCliente] = useState(null);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para loading
    const [loading, setLoading] = useState(true);

    // Carga el cliente al montar o cambiar el id
    useEffect(() => {
        cargarCliente();
    }, [id]);

    const cargarCliente = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mostrarClientes({ id });
            const encontrado = response.data;
            if (encontrado) {
                setCliente(encontrado);
            } else {
                setError('No se encontró el cliente');
            }
        } catch (error) {
            setError('Error al cargar el cliente');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        // Muestra un mensaje de carga
        return (
            <div className="detalle-cliente">
                <div className="text-center">
                    <span>Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        // Muestra errores y un botón para volver
        return (
            <div className="detalle-cliente">
                <div className="info-cliente">
                    <div className="alert alert-danger">{error}</div>
                    <button className="btn-volver" onClick={() => navigate('/clientes')}>Volver a Clientes</button>
                </div>
            </div>
        );
    }

    if (!cliente) return null;

    return (
        <div className="detalle-cliente">
            <div className="header-cliente">
                <h1>Detalle del Cliente</h1>
                <button className="btn-volver" onClick={() => navigate('/clientes')}>Volver a Clientes</button>
            </div>
            <div className="info-cliente">
                <h3>{cliente.nombre}</h3>
                <p><strong>Razón Social:</strong> {cliente.razonSocial}</p>
                <p><strong>Correo:</strong> {cliente.correo}</p>
                <p><strong>CUIT:</strong> {cliente.cuit}</p>
            </div>
        </div>
    );
}