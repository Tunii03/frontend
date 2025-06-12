import React from 'react';
import './Inicio.css';
import Image from 'react-bootstrap/Image';

export default function Inicio() {
  return (
    <div className="inicio-container">
      <div className='titulo'>
        <h1>
          Sistema de Gestión de Recursos Empresariales
        </h1>
      </div>

      <div className='imagen'>
        <Image src="/imagen.jpg" fluid />
      </div>
    </div>
  );
}