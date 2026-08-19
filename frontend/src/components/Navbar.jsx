import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "../navbar.css";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => setMenuActive(!menuActive);

  // Verificación flexible del rol de administrador
  const isAdmin =
    user?.role === "ROLE_ADMIN" ||
    user?.roles?.includes("ROLE_ADMIN") ||
    user?.authorities?.some((a) => a.authority === "ROLE_ADMIN");

  return (
    <nav className="navbar w-full bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
      <div 
        className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center relative"
        style={{ width: "100%", margin: "0 auto" }}
      >
        <ul 
          className={`navbar-menu ${menuActive ? "active" : ""} flex items-center justify-center gap-6 md:gap-8 w-full`}
          style={{ margin: "0 auto", padding: "0", listStyle: "none" }}
        >
          <li>
            <NavLink 
              to="/home" 
              className={({ isActive }) => 
                isActive 
                  ? "text-emerald-400 font-bold transition-colors" 
                  : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
              }
            >
              Inicio
            </NavLink>
          </li>

          {/* Menú exclusivo para Administradores */}
          {isAdmin && (
            <>
              <li>
                <NavLink 
                  to="/propietarios"
                  className={({ isActive }) => 
                    isActive 
                      ? "text-emerald-400 font-bold transition-colors" 
                      : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
                  }
                >
                  Propietarios
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/vehiculos"
                  className={({ isActive }) => 
                    isActive 
                      ? "text-emerald-400 font-bold transition-colors" 
                      : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
                  }
                >
                  Vehículos
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/usuarios"
                  className={({ isActive }) => 
                    isActive 
                      ? "text-emerald-400 font-bold transition-colors" 
                      : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
                  }
                >
                  Usuarios
                </NavLink>
              </li>
            </>
          )}

          {/* Visible para todos los roles */}
          <li>
            <NavLink 
              to="/control_vehiculos"
              className={({ isActive }) => 
                isActive 
                  ? "text-emerald-400 font-bold transition-colors" 
                  : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
              }
            >
              Control de Vehículos
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/logout"
              className="text-base-content font-semibold hover:text-red-400 transition-colors"
            >
              Cerrar Sesión
            </NavLink>
          </li>

          <li className="flex items-center">
            <ThemeToggle />
          </li>
        </ul>

        {/* Botón hamburguesa móvil */}
        <button
          className={`navbar-toggle ${
            menuActive ? "active" : ""
          } text-base-content md:hidden absolute right-4`}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;