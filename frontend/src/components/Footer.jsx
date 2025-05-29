import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Footer = () => {
  const { user } = useContext(AuthContext); // Acceso al usuario desde contexto

  return (
    <footer className="bg-base-200 text-base-content py-6 m-3.5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 text-center text-xl">
          <NavLink to="/home" className="hover:text-green-400 transition-colors duration-200">Inicio</NavLink>

          {user?.role === "ROLE_ADMIN" && (
            <>
          <NavLink to="/usuarios" className="hover:text-green-400 transition-colors duration-200">Usuarios</NavLink>
          <NavLink to="/propietarios" className="hover:text-green-400 transition-colors duration-200">Propietarios</NavLink>
          <NavLink to="/vehiculos" className="hover:text-green-400 transition-colors duration-200">Vehículos</NavLink>
          </>
          )}
          <>
          <NavLink to="/control_vehiculos" className="hover:text-green-400 transition-colors duration-200">Control de Vehículos</NavLink>
          
          <NavLink to="/logout" className="hover:text-green-400 transition-colors duration-200">Cerrar Sesión</NavLink>
          </>
        </div>
        <div className="mt-4 text-center text-sm opacity-60">
          &copy; 2025 Hong
        </div>
      </div>
    </footer>
  );
};

export default Footer;
