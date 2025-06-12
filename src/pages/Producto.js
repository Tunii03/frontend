import {useState,useEffect} from 'react'
import axios from 'axios'
    export function crearProducto(nombre,stock,descripcion,precio){
        const datos = {
            nombre: nombre,
            stock: stock,
            descripcion:descripcion,
            precio: precio
        }
        axios.post('http://localhost:8080/api/producto',datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    export function buscarProductos(){
        const [productos, setProductos] = useState([])
        axios.get(`http://localhost:8080/api/producto`)
        .then((data)=>{
            setProductos(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function mostrarProducto({id}){
        const [producto,setProducto] = useState([])
        axios.get(`http://localhost:8080/api/producto/${id}`)
         .then((data)=>{
            setProducto(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function actualizarProducto({id,nombre,stock,descripcion,precio}){
        const datos ={
            nombre: nombre,
            stock: stock,
            descripcion:descripcion,
            precio: precio
        }
        axios.put(`http://localhost:8080/api/producto/${id}`,datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    export function borrarProducto ({id}){
        axios.delete(`http://localhost:8080/api/producto/${id}`)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
