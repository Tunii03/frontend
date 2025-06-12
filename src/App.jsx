import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './componentes/home/Inicio.jsx';
import ListaProductos from './componentes/Productos/ListaProductos';
import DetalleProducto from './componentes/Productos/DetalleProducto';
import NavbarComponent from './componentes/Navbar/Navbar';
import Pedidos from './componentes/Pedidos/Pedidos';
import DetallePedido from './componentes/Pedidos/DetallePedido';

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
            <Route path='/clientes' element={<div>Página de Clientes</div>} />
            <Route path='/pedidos' element={<Pedidos />} />
            <Route path='/pedidos/:id' element={<DetallePedido />} />
            <Route path='/presupuestos' element={<div>Página de Presupuestos</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
