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
    
    // --- PARCHE DE EMERGENCIA ---
    if (datos.user || datos.usuario) {
      // Si Ángela lo arregla y envía el usuario, usamos el suyo
      localStorage.setItem('orbitUser', JSON.stringify(datos.user || datos.usuario));
    } else {
      // Si no lo envía, extraemos el nombre del email (ej: de angela@test.com sacamos "angela")
      const nombreExtraido = email.split('@')[0];
      // Ponemos la primera letra en mayúscula para que quede bonito ("Angela")
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
    const token = localStorage.getItem('orbitToken');
    if (!token) throw new Error("No hay token");
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
    const token = localStorage.getItem('orbitToken');
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

const obtenerToken = () => localStorage.getItem('orbitToken');

export const enviarMensajeChat = async (mensaje) => {
  try {
    const token = obtenerToken();
    
    // Si no hay token, ni siquiera intentamos la petición
    if (!token) throw new Error("No hay sesión activa");

    const respuesta = await fetch("https://orbitspace-backend.onrender.com/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 🚨 AQUÍ ESTÁ LA CLAVE: El servidor espera "Bearer" seguido del token
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ mensaje })
    });

    if (respuesta.status === 401) {
      // Si el token expiró o es inválido, cerramos sesión
      cerrarSesion();
      throw new Error("Sesión expirada");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error en el enlace del chat:", error);
    return { error: "Error de comunicación" };
  }
};