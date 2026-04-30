import { AlertaEspacial, ToastEspacial } from './alertas';

export const login = async (email, password) => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/auth/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }) 
    });

    if (!respuesta.ok) {
      // Mejora: Alerta visual de error en lugar de solo fallar por consola
      AlertaEspacial.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Credenciales incorrectas. Revisa tu identificación orbital.'
      });
      return false;
    }

    const datos = await respuesta.json();
    localStorage.setItem('orbitToken', datos.token);
    
    let userObj;
    if (datos.user || datos.usuario) {
      userObj = datos.user || datos.usuario;
      localStorage.setItem('orbitUser', JSON.stringify(userObj));
    } else {
      const nombreExtraido = email.split('@')[0];
      const nombreFormateado = nombreExtraido.charAt(0).toUpperCase() + nombreExtraido.slice(1);
      userObj = { nombre: nombreFormateado, email: email };
      localStorage.setItem('orbitUser', JSON.stringify(userObj));
    }

    // Mejora: Notificación sutil de bienvenida
    ToastEspacial.fire({
      icon: 'success',
      title: `Bienvenida a bordo, ${userObj.nombre}`
    });

    return true; 
  } catch (error) {
    console.error(error);
    AlertaEspacial.fire({
      icon: 'warning',
      title: 'Fallo de Conexión',
      text: 'No se pudo contactar con el servidor central.'
    });
    return false; 
  }
};

export const obtenerSatelites = async (lat, lng) => {
  try {
    // Ruta correcta restaurada: /satellites/active
    const url = `https://orbitspace-backend.onrender.com/satellites/active?lat=${lat}&lng=${lng}`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) return [];
    return await respuesta.json();
  } catch (error) {
    return [];
  }
};

export const obtenerLanzamientos = async () => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/launches");
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();

    // 🔥 LOG DE PRUEBA PARA DAVID:
    console.log("🚀 LANZAMIENTOS (David):", datos);
    
    return datos;
  } catch (error) {
    return [];
  }
};

export const obtenerFavoritos = async () => {
  try {
    const token = localStorage.getItem('orbitToken');
    if (!token) return [];
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/favorites", {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();

    // 🔥 LOG DE PRUEBA PARA ÁNGELA:
    console.log("💖 FAVORITOS (Ángela):", datos);

    return datos;
  } catch (error) {
    return [];
  }
};

export const toggleFavorito = async (vehiculoId) => {
  try {
    const token = localStorage.getItem('orbitToken');
    if (!token) return false;
    const respuesta = await fetch(`https://orbitspace-backend.onrender.com/favorites/${vehiculoId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return respuesta.ok;
  } catch (error) {
    return false;
  }
};

export const obtenerDatosUsuario = () => {
  // Función original, síncrona y a prueba de fallos (Evita el error 404 del perfil)
  const usuarioRaw = localStorage.getItem('orbitUser');
  return usuarioRaw ? JSON.parse(usuarioRaw) : { nombre: "Comandante", email: "desconocido@orbit.space" };
};

export const cerrarSesion = () => {
  // Mejora: Alerta de confirmación antes de borrar los datos
  AlertaEspacial.fire({
    title: '¿Desconectar terminal?',
    text: "Se cerrará la conexión segura con OrbitSpace.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Desconectar',
    cancelButtonText: 'Mantener conexión'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('orbitToken');
      localStorage.removeItem('orbitUser');
      localStorage.removeItem('orbitspace_auth');
      window.location.href = "/"; 
    }
  });
};

export const enviarMensajeChat = async (mensaje) => {
  try {
    const token = localStorage.getItem('orbitToken');
    if (!token) throw new Error("No hay sesión activa");
    
    // Ruta correcta restaurada: /ai/chat
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/ai/chat", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: mensaje }) // Variable question restaurada
    });
    const data = await respuesta.json();
    return { respuesta: data.answer || data.respuesta || "Sin respuesta del satélite." };
  } catch (error) {
    return { error: "Error de comunicación con la IA" };
  }
};