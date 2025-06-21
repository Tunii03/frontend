import axios from 'axios'

export function crearPago(idPresupuesto){
    const datos = {
        presupuestoId: idPresupuesto
    }
    return axios.post('http://localhost:8080/api/pago',datos)
    .then(function(response){
        console.log('Pago creado:', response.data);
        return response;
    })
    .catch(function(error){
        console.error('Error al crear pago:', error);
        throw error;
    })
}

export function buscarPagos(){
    return axios.get(`http://localhost:8080/api/pago`)
    .then((response)=>{
        console.log('Pagos recibidos:', response.data);
        return response;
    })
    .catch((error)=>{
        console.error('Error al buscar pagos:', error);
        throw error;
    })
}

export function mostrarPago({id}){
    return axios.get(`http://localhost:8080/api/pago/${id}`)
    .then((response)=>{
        console.log('Pago encontrado:', response.data);
        return response;
    })
    .catch((error)=>{
        console.error('Error al mostrar pago:', error);
        throw error;
    })
}
    