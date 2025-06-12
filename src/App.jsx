import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './componentes/home/Inicio.jsx';
import ListaProductos from './componentes/Productos/ListaProductos';
import DetalleProducto from './componentes/Productos/DetalleProducto';
import NavbarComponent from './componentes/Navbar/Navbar';
<<<<<<< HEAD
import FormularioCliente from './componentes/Cliente/AgregarCliente.jsx';
import DetalleCliente from './componentes/Cliente/DetalleCliente.jsx';
=======
import Pedidos from './componentes/Pedidos/Pedidos';
import DetallePedido from './componentes/Pedidos/DetallePedido';
>>>>>>> ddb08d641927b75c64c25d4c2b9abed7f8405001

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavbarComponent />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/productos' element={<ListaProductos />} />
            <Route path='/productos/:id' element={<DetalleProducto />} />
<<<<<<< HEAD
            <Route path='/clientes' element={
              <>
                <FormularioCliente />
                <DetalleCliente />
              </>
            } />
            <Route path='/pedidos' element={<div>Página de Pedidos</div>} />
=======
            <Route path='/clientes' element={<div>Página de Clientes</div>} />
            <Route path='/pedidos' element={<Pedidos />} />
            <Route path='/pedidos/:id' element={<DetallePedido />} />
>>>>>>> ddb08d641927b75c64c25d4c2b9abed7f8405001
            <Route path='/presupuestos' element={<div>Página de Presupuestos</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
