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
