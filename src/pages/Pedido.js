<<<<<<< HEAD
import axios from 'axios';

export function crearPedido({monto, idcliente}) {
    const datos = {
        monto: monto,
        clienteId: idcliente
    };
    return axios.post('http://localhost:8080/api/pedido', {datos})
        .then(response => response.data)
        .catch(error => {
            console.error('Error al crear pedido:', error);
            throw error;
        });
}

export function agregarProducto({idPedido, idProducto, cantidad, monto}) {
    const datos = {
        idProducto: idProducto,
        cantidad: cantidad,
        monto: monto
    };
    return axios.post(`http://localhost:8080/api/pedido/${idPedido}/producto`, {datos})
        .then(response => response.data)
        .catch(error => {
            console.error('Error al agregar producto:', error);
            throw error;
        });
}

export function obtenerPedidos() {
    return axios.get('http://localhost:8080/api/pedido')
        .then(response => response.data)
        .catch(error => {
            console.error('Error al obtener pedidos:', error);
            throw error;
        });
}

export function obtenerPedido(id) {
    return axios.get(`http://localhost:8080/api/pedido/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error al obtener pedido:', error);
            throw error;
        });
}

export function actualizarPedido({id, monto}) {
    const datos = {
        monto: monto
    };
    return axios.put(`http://localhost:8080/api/pedido/${id}`, {datos})
        .then(response => response.data)
        .catch(error => {
            console.error('Error al actualizar pedido:', error);
            throw error;
        });
}

export function eliminarPedido(id) {
    return axios.delete(`http://localhost:8080/api/pedido/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error al eliminar pedido:', error);
            throw error;
        });
} 
=======
import {useState,useEffect} from 'react'
import axios from 'axios'


    const [idPedido, setIdPedido] = useState()

    export function crearPedido({monto,idcliente}){
        const datos = {
            monto:monto,
            clienteId: idcliente
        }
        axios.post('http://localhost:8080/api/pedido',datos)
        .then(function(response){
            console.log(response)
            setIdPedido(response.data.id)

        })
        .catch(function(error){
            console.log(error)
        })
    }
    export function agregarProducto({idProducto,monto}){
        const datos = {
            idProducto: idProducto,
            monto:monto
        }
        axios.post(`http://localhost:8080/api/pedido/${idPedido}/producto`,datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }

    export function buscarPedidos(){
        const [pedidos, setPedidos] = useState([])
        axios.get(`http://localhost:8080/api/pedido`)
        .then((data)=>{
            setPedidos(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function mostrarPedido({id}){
        const [pedido,setPedido] = useState([])
        axios.get(`http://localhost:8080/api/pedido/${id}`)
        .then((data)=>{
            setPedido(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function actualizarPedido({id,monto}){
        const datos ={
            monto:monto
        }
        axios.put(`http://localhost:8080/api/producto/${id}`,datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    export function borrarPedido ({id}){
        axios.delete(`http://localhost:8080/api/pedido/${id}`)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
>>>>>>> 8e808b704b878675c0140b42d0d8374f69f57bfa
