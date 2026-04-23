import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegida({ children }) {
  const isAuthenticated = localStorage.getItem('orbitToken');

  if (!isAuthenticated) {
    console.warn("⚠️ Intruso detectado. Redirigiendo al Login...");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;