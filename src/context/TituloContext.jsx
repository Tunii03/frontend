import React, { createContext, useState, useContext } from 'react';

const TituloContext = createContext();

export function TituloProvider({ children }) {
  const [titulo, setTitulo] = useState('Tunitos ERP');

  return (
    <TituloContext.Provider value={{ titulo, setTitulo }}>
      {children}
    </TituloContext.Provider>
  );
}

export function useTitulo() {
  return useContext(TituloContext);
}