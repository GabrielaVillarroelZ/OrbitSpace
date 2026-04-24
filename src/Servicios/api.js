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
      
      localStorage.setItem('orbitUser', JSON.stringify({ 
        nombre: nombreFormateado, 
        email: email 
      }));
    }
    
    return true; 
  } catch (error) {
    console.error(error);
    return false; 
  }
};

export const obtenerSatelites = async () => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/satellites/active");
    if (!respuesta.ok) throw new Error("Error de conexión");
    return await respuesta.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const obtenerLanzamientos = async () => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/launches");
    if (!respuesta.ok) throw new Error("Error en lanzamientos");
    return await respuesta.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const obtenerFavoritos = async () => {
  try {
    const tokenRaw = localStorage.getItem('orbitToken');
    if (!tokenRaw) return [];

    const token = tokenRaw.replace(/['"]+/g, '').trim();

    const respuesta = await fetch("https://orbitspace-backend.onrender.com/favorites", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    });

    if (!respuesta.ok) throw new Error("Error en favoritos");
    return await respuesta.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const toggleFavorito = async (vehiculoId) => {
  try {
    const tokenRaw = localStorage.getItem('orbitToken');
    if (!tokenRaw) return false;

    const token = tokenRaw.replace(/['"]+/g, '').trim();

    const respuesta = await fetch(`https://orbitspace-backend.onrender.com/favorites/${vehiculoId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return respuesta.ok;
  } catch (error) {
    console.error(error);
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
    const tokenRaw = localStorage.getItem('orbitToken');
    if (!tokenRaw) throw new Error("No hay sesión activa");

    const token = tokenRaw.replace(/['"]+/g, '').trim();

    const respuesta = await fetch("https://orbitspace-backend.onrender.com/ai/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question: mensaje })
    });

    if (respuesta.status === 405) {
      return { respuesta: "❌ Error 405: Método no permitido." };
    }

    if (respuesta.status === 401) {
      cerrarSesion();
      throw new Error("Sesión expirada");
    }

    const data = await respuesta.json();
    return { respuesta: data.answer || "Sin respuesta del satélite de IA." };
  } catch (error) {
    console.error(error);
    return { error: "Error de comunicación con la IA" };
  }
};