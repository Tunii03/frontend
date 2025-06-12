import {useState,useEffect} from 'react'
import axios from 'axios'

export function Pago({}){
    function crearPago({idPresupuesto}){
        const datos = {
            idPresupuesto:idPresupuesto
        }
        axios.post('http://localhost:8080/api/pago',{datos})
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    function buscarPagos(){
        const [pagos, setPagos] = useState([])
        axios.get(`http://localhost:8080/api/pagos`,{})
        .then((data)=>{
            setPresupuesto(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    function mostrarPago({id}){
        const [pago,setPago] = useState([])
        axios.get(`http://localhost:8080/api/pago/${id}`,{})
        .then((data)=>{
            setPago(data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    
   
}