import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './componentes/home/Inicio.jsx';
import ListaProductos from './componentes/Productos/ListaProductos';
import DetalleProducto from './componentes/Productos/DetalleProducto';
import EditarProducto from './componentes/Productos/EditarProducto.jsx';
import NavbarComponent from './componentes/Navbar/Navbar';
import Pedidos from './componentes/Pedidos/ListaPedidos';
import DetallePedido from './componentes/Pedidos/DetallePedido';
import EditarPedido from './componentes/Pedidos/EditarPedido.jsx';
import AgregarCliente from './componentes/Cliente/AgregarCliente.jsx';
import ListaClientes from './componentes/Cliente/ListaClientes.jsx';
import EditarCliente from './componentes/Cliente/EditarCliente.jsx';
import ListaPresupuestos from './componentes/Presupuestos/ListaPresupuestos.jsx';
import AgregarPresupuesto from './componentes/Presupuestos/AgregarPresupuesto.jsx';
import DetallePresupuesto from './componentes/Presupuestos/DetallePresupuesto.jsx';
import ListaPagos from './componentes/Pagos/ListaPagos.jsx';
import AgregarPago from './componentes/Pagos/AgregarPago.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavbarComponent />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/productos' element={<ListaProductos />} />
            <Route path='/productos/editar/:id' element={<EditarProducto />} />
            <Route path='/productos/:id' element={<DetalleProducto />} />
            <Route path='/clientes' element={<ListaClientes />} />
            <Route path='/clientes/agregar' element={<AgregarCliente />} />
            <Route path='/clientes/editar/:id' element={<EditarCliente />} />
            <Route path='/pedidos' element={<Pedidos />} />
            <Route path='/pedidos/editar/:id' element={<EditarPedido />} />
            <Route path='/pedidos/:id' element={<DetallePedido />} />
            <Route path='/presupuestos' element={<ListaPresupuestos />} />
            <Route path='/presupuestos/agregar' element={<AgregarPresupuesto />} />
            <Route path='/presupuestos/:id' element={<DetallePresupuesto />} />
            <Route path='/pago' element={<ListaPagos />} />
            <Route path='/pago/agregar' element={<AgregarPago />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
