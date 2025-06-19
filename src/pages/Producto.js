import {useState,useEffect} from 'react'
import axios from 'axios'
    export function crearProducto(nombre,stock,descripcion,precio){
        const datos = {
            nombre: nombre,
            stock: stock,
            descripcion:descripcion,
            precio: precio
        }
        return axios.post('http://localhost:8080/api/producto',datos)
        .then(function(response){
            console.log(response)
            return response
        })
        .catch(function(error){
            console.log(error)
            throw error
        })
    }
    export function buscarProductos(){
        return axios.get(`http://localhost:8080/api/producto`)
        .then((response)=>{
            return response
        })
        .catch((error)=>{
            console.log(error)
            throw error
        })
    }
    export function mostrarProducto({id}){
        return axios.get(`http://localhost:8080/api/producto/${id}`)
         .then((response)=>{
            return response
        })
        .catch((error)=>{
            console.log(error)
            throw error
        })
    }
    export function actualizarProducto({id,nombre,stock,descripcion,precio}){
        const datos ={
            id: id,
            nombre: nombre,
            stock: stock,
            descripcion:descripcion,
            precio: precio
        }
        return axios.put(`http://localhost:8080/api/producto/${id}`,datos)
        .then(function(response){
            console.log(response)
            return response
        })
        .catch(function(error){
            console.log(error)
            throw error
        })
    }
    export function borrarProducto ({id}){
        return axios.delete(`http://localhost:8080/api/producto/${id}`)
        .then(function(response){
            console.log(response)
            return response
        })
        .catch(function(error){
            console.log(error)
            throw error
        })
    }
