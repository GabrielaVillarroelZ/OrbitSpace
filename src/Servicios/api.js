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