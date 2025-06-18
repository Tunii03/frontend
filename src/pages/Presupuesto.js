import {useState,useEffect} from 'react'
import axios from 'axios'

    export function crearPresupuesto({idpedido,estado}){
        const datos = {
            estado:estado,
            pedidoId:idpedido
        }
        axios.post('http://localhost:8080/api/presupuesto',datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    export function buscarPresupuestos(){
        const [presupuestos, setPresupuestos] = useState([])
        axios.get(`http://localhost:8080/api/presupuesto`)
        .then((data)=>{
            setPresupuesto(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function mostrarPresupuesto({id}){
        const [presupuesto,setPresupuesto] = useState([])
        axios.get(`http://localhost:8080/api/presupuesto/${id}`)
        .then((data)=>{
            setPresupuesto(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    export function actualizarPresupuesto({id,monto}){
        const datos ={
            monto:monto
        }
        axios.put(`http://localhost:8080/api/presupuesto/${id}`,datos)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
   
