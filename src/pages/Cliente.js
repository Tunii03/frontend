import axios from 'axios'

    export async function crearCliente(nombre, razonSocial, email, cuit){
        const datos = {
            nombre: nombre,
            razonSocial: razonSocial,
            email: email,
            cuit: cuit,
        }
        try {
            const response = await axios.post('http://localhost:8080/api/cliente', datos);
            return response.data; 
        } catch (error) {
            throw error;
        }
    }
    export async function buscarClientes() {
    try {
        const response = await axios.get('http://localhost:8080/api/cliente');
        return response; 
        } catch (error) {
            throw error;
        }
    }

    export async function mostrarClientes(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/cliente/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    export async function actualizarCliente({id, nombre, razonSocial, email, cuit}){ // Añadido 'async'
    const datos ={
        id: id,
        nombre: nombre,
        razonSocial: razonSocial,
        email: email,
        cuit: cuit,
    }
    try {
        const response = await axios.put(`http://localhost:8080/api/cliente/${id}`, datos); // Usando 'await'
        console.log(response);
        return response.data; 
    } catch (error) {
        console.error("Error al actualizar el cliente:", error.response ? error.response.data : error.message);
        throw error; 
    }
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