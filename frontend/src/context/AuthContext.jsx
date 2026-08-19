import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Detecta automáticamente la URL del backend según el entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api-vehiculos";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Comprobar sesión activa al montar
  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      // Formatear las credenciales (convierte 'nombre' a mayúsculas si existe)
      const payload = {
        ...credentials,
        nombre: credentials.nombre ? credentials.nombre.toUpperCase() : credentials.nombre
      };

      const res = await axios.post(`${API_URL}/api/auth/login`, payload, {
        withCredentials: true,
      });
      setUser(res.data.user); // actualiza estado
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Error desconocido",
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);