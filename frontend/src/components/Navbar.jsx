import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "../navbar.css";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar w-full bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
      <div 
        className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center relative"
        style={{ width: "100%", margin: "0 auto" }}
      >
        {/* Unificación y centrado total de la lista */}
        <ul 
          className={`navbar-menu ${menuActive ? "active" : ""} flex items-center justify-center gap-4 md:gap-6 w-full`}
          style={{ margin: "0 auto", padding: "0", listStyle: "none" }}
        >
          <li>
            <NavLink 
              to="/home" 
              className={({ isActive }) => 
                isActive 
                  ? "px-4 py-2 bg-emerald-500/20 text-emerald-400 font-bold rounded-full transition-all" 
                  : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
              }
            >
              Inicio
            </NavLink>
          </li>

          {user?.role === "ROLE_ADMIN" && (
            <>
              <li>
                <NavLink 
                  to="/propietarios"
                  className={({ isActive }) => 
                    isActive ? "text-emerald-400 font-bold" : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
                  }
                >
                  Propietarios
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/vehiculos"
                  className={({ isActive }) => 
                    isActive ? "text-emerald-400 font-bold" : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
                  }
                >
                  Vehículos
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/usuarios"
                  className={({ isActive }) => 
                    isActive ? "text-emerald-400 font-bold" : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
                  }
                >
                  Usuarios
                </NavLink>
              </li>
            </>
          )}

          {/* Visible para ambos roles */}
          <li>
            <NavLink 
              to="/control_vehiculos"
              className={({ isActive }) => 
                isActive ? "text-emerald-400 font-bold" : "text-base-content font-semibold hover:text-emerald-400 transition-colors"
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

        {/* Botón hamburguesa para móvil (posicionado a la derecha en pantallas pequeñas) */}
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