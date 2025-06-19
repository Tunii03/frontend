import {useState,useEffect} from 'react'
import axios from 'axios'

    export function crearPresupuesto(idpedido,estado){
        const datos = {
            estado:estado,
            pedidoId:idpedido
        }
        return axios.post('http://localhost:8080/api/presupuesto',datos)
        .then(function(response){
            console.log(response)
            return response
        })
        .catch(function(error){
            console.log(error)
            throw error
        })
    }
    export function buscarPresupuestos(){
        const [presupuestos, setPresupuestos] = useState([])
        return axios.get(`http://localhost:8080/api/presupuesto`)
        .then((data)=>{
            setPresupuesto(data)
            return data
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function mostrarPresupuesto({id}){
        const [presupuesto,setPresupuesto] = useState([])
        return axios.get(`http://localhost:8080/api/presupuesto/${id}`)
        .then((data)=>{
            setPresupuesto(data)
            return data
        })
        .catch((error)=>{
            console.log(error)
            throw error
        })
    }
    export function actualizarPresupuesto({id,monto}){
        const datos ={
            monto:monto
        }
        return axios.put(`http://localhost:8080/api/presupuesto/${id}`,datos)
        .then(function(response){
            console.log(response)
            return response
        })
        .catch(function(error){
            console.log(error)
            throw error
        })
    }
   
