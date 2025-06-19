import axios from 'axios';

export function crearPedido({monto, clienteId}) {
    const datos = {
        monto: monto,
        clienteId: clienteId
    };
    return axios.post('http://localhost:8080/api/pedido', datos)
    .then(function(response){
        console.log('Respuesta del servidor:', response);
        return response;
    })
    .catch(function(error){
        console.log('Error al crear pedido:', error);
        throw error;
    });
}

export function agregarProducto({idPedido, idProducto, cantidad, monto}) {
    const datos = {
        idProducto: idProducto,
        cantidad: cantidad,
        monto: monto
    };
    return axios.post(`http://localhost:8080/api/pedido/${idPedido}/producto`, datos)
        .then(response => response.data)
        .catch(error => {
            console.error('Error al agregar producto:', error);
            throw error;
        });
}

export function obtenerPedidos() {
    return axios.get('http://localhost:8080/api/pedido')
        .then(response => {
            console.log('Pedidos recibidos:', response.data);
            return response.data;
        })
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
    return axios.put(`http://localhost:8080/api/pedido/${id}`, datos)
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

