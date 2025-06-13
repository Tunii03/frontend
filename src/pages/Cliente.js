import {useState,useEffect} from 'react'
import axios from 'axios'

    export function crearCliente(nombre, razonSocial, correo, cuit){
        const datos = {
            nombre: nombre,
            razonSocial: razonSocial,
            correo: correo,
            cuit: cuit,
        }
        axios.post('http://localhost:8080/api/cliente',datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }

    export function mostrarClientes({id}){
        const [cliente,setCliente] = useState([])
        axios.get(`http://localhost:8080/api/cliente/${id}`,{})
         .then((data)=>{
            setCliente(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    export function actualizarCliente({id, nombre, razonSocial, correo, cuit}){
        const datos ={
            nombre: nombre,
            razonSocial: razonSocial,
            correo: correo,
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