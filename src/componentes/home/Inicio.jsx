import React, { useEffect } from 'react';
import './Inicio.css';
import Image from 'react-bootstrap/Image';
import { useTitulo } from '../../context/TituloContext';

export default function Inicio() {
  const { titulo, setTitulo } = useTitulo();
  useEffect(() => {
    setTitulo('Tunitos ERP');
  }, [setTitulo]);

  return (
    <div className="inicio-container">
      <div className='titulo'>
        <h1>
          {titulo}
        </h1>
      </div>

      <div className='imagen'>
        <Image src="/imagen.jpg" fluid />
      </div>
    </div>
  );
}