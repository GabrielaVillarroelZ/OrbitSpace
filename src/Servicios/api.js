export const login = async (email, password) => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }) 
    });

    if (!respuesta.ok) {
      throw new Error("Credenciales denegadas por el servidor");
    }

    const datos = await respuesta.json();
    
    localStorage.setItem('orbitToken', datos.token);
    

    if (datos.user || datos.usuario) {
      localStorage.setItem('orbitUser', JSON.stringify(datos.user || datos.usuario));
    }

    console.log("✅ Acceso concedido. Token guardado.");
    return true; 

  } catch (error) {
    console.error("❌ Fallo en el acceso:", error);
    return false; 
  }
};

export const obtenerSatelites = async () => {
  try {
    const respuesta = await fetch("https://orbitspace-backend.onrender.com/satellites/active");
    if (!respuesta.ok) throw new Error("Error de conexión");
    
    const datos = await respuesta.json();
    console.log("🛰️ Señal recibida:", datos);
    return datos;
  } catch (error) {
    console.error("Fallo de comunicación:", error);
    return [];
  }
};

export const obtenerFavoritos = async () => {
  try {
    const token = localStorage.getItem('orbitToken');

    if (!token) {
      throw new Error("No hay token. El usuario no ha iniciado sesión.");
    }

    const respuesta = await fetch("https://orbitspace-backend.onrender.com/favorites", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    });

    if (!respuesta.ok) throw new Error("Acceso denegado a favoritos");

    const datos = await respuesta.json();
    console.log("⭐ Favoritos recibidos:", datos);
    return datos;
    
  } catch (error) {
    console.error("Fallo al obtener favoritos:", error);
    return [];
  }
};