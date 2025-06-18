import {useState,useEffect} from 'react'
import axios from 'axios'

    export async function crearCliente(nombre, razonSocial, email, cuit){
        const datos = {
            nombre: nombre,
            razonSocial: razonSocial,
            email: email,
            cuit: cuit,
        }
        try {
            const response = await axios.post('http://localhost:8080/api/cliente', datos);
            return response.data; 
        } catch (error) {
            throw error;
        }
    }
    export async function buscarClientes() {
    try {
        const response = await axios.get('http://localhost:8080/api/cliente');
        return response; 
        } catch (error) {
            throw error;
        }
    }

    export async function mostrarClientes(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/cliente/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    export function actualizarCliente({id, nombre, razonSocial, correo, cuit}){
        const datos ={
            nombre: nombre,
            razonSocial: razonSocial,
            email: email,
            cuit: cuit,
        }
        axios.put(`http://localhost:8080/api/cliente/${id}`,datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    export function borrarCliente ({id}){
        axios.delete(`http://localhost:8080/api/cliente/${id}`,{})
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }