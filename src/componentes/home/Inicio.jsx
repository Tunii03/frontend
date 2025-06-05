import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import './Inicio.css';

import Image from 'react-bootstrap/Image';

export default function Inicio() {
  return (
    <>
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home" className="mu-auto">Inicio</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto"> 
            <Nav.Link href="#productos">Productos</Nav.Link>
            <Nav.Link href="#clientes">Clientes</Nav.Link>
            <Nav.Link href="#pedidos">Pedidos</Nav.Link>
            <Nav.Link href="#presupuestos">Presupuestos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <div className='titulo'>
      <h1>
        Sistema de Gestion de Recursos Empresariales
      </h1>
    </div>

    <div className='imagen'>
    <Image src="/imagen.jpg" fluid />
    </div>
    </>
);
};