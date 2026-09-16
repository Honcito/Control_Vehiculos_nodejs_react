import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta a tu AuthContext

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout(); // Cierra sesión en el backend
      localStorage.clear(); // Limpia localStorage
      sessionStorage.clear();
      window.location.href = "/login"; // Recarga dura para destruir estado de React
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Cerrando sesión...</p>
    </div>
  );
};

export default Logout;