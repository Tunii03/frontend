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
        const [presupuestos, setPresupuestos] = useState([])
        return axios.get(`http://localhost:8080/api/presupuesto`)
        .then((data)=>{
            setPresupuesto(data)
            return presupuestos
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
            return presupuesto
        })
        .catch((error)=>{
            console.log(error)
            throw error
        })
    }

   
