import axios from 'axios'

export function crearPresupuesto(pedidoId){
    const datos = {
        estado:false,
        pedidoId:pedidoId
    }
    return axios.post('http://localhost:8080/api/presupuesto', datos)
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
    return axios.get(`http://localhost:8080/api/presupuesto`)
    .then((response)=>{
        console.log(response)
        return response
    })
    .catch((error)=>{
        console.log(error)
        throw error
    })
}
export function mostrarPresupuesto(id){
    return axios.get(`http://localhost:8080/api/presupuesto/${id}`)
    .then((response)=>{
        console.log(response)
        return response
    })
    .catch((error)=>{
        console.log(error)
        throw error
    })
}

   
