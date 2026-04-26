export const login = async (email, password) => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/auth/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }) 
    });
    if (!respuesta.ok) throw new Error("Credenciales denegadas");
    const datos = await respuesta.json();
    localStorage.setItem('orbitToken', datos.token);
    if (datos.user || datos.usuario) {
      localStorage.setItem('orbitUser', JSON.stringify(datos.user || datos.usuario));
    } else {
      const nombreExtraido = email.split('@')[0];
      const nombreFormateado = nombreExtraido.charAt(0).toUpperCase() + nombreExtraido.slice(1);
      localStorage.setItem('orbitUser', JSON.stringify({ nombre: nombreFormateado, email: email }));
    }
    return true; 
  } catch (error) {
    console.error(error);
    return false; 
  }
};

export const obtenerSatelites = async (lat, lng) => {
  try {
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
  const usuarioRaw = localStorage.getItem('orbitUser');
  return usuarioRaw ? JSON.parse(usuarioRaw) : { nombre: "Comandante", email: "desconocido@orbit.space" };
};

export const cerrarSesion = () => {
  localStorage.removeItem('orbitToken');
  localStorage.removeItem('orbitUser');
  localStorage.removeItem('orbitspace_auth');
  window.location.href = "/"; 
};

export const enviarMensajeChat = async (mensaje) => {
  try {
    const token = localStorage.getItem('orbitToken');
    if (!token) throw new Error("No hay sesión activa");
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/ai/chat", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: mensaje })
    });
    const data = await respuesta.json();
    return { respuesta: data.answer || data.respuesta || "Sin respuesta del satélite." };
  } catch (error) {
    return { error: "Error de comunicación con la IA" };
  }
};