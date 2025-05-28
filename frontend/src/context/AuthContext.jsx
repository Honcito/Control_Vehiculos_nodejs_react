import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Comprobar sesión activa al montar
  useEffect(() => {
    axios.get("http://localhost:3000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", credentials, {
        withCredentials: true,
      });
      setUser(res.data.user); // actualiza estado
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || "Error desconocido" };
    }
  };

  // Logout
  const logout = async () => {
    await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
