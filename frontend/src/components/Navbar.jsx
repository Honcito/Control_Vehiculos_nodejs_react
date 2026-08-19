import { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "/images/GrasalvaLogo.JPEG";
import "../navbar.css";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          <img src={logo} alt="Logo Grasalva" />
        </Link>

        {/* Unificación de todo el menú en una sola lista flex */}
        <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
          <li>
            <NavLink to="/home">Inicio</NavLink>
          </li>

          {user?.role === "ROLE_ADMIN" && (
            <>
              <li>
                <NavLink to="/propietarios">Propietarios</NavLink>
              </li>
              <li>
                <NavLink to="/vehiculos">Vehículos</NavLink>
              </li>
              <li>
                <NavLink to="/usuarios">Usuarios</NavLink>
              </li>
            </>
          )}

          {/* Visible para ambos roles */}
          <li>
            <NavLink to="/control_vehiculos">Control de Vehículos</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Cerrar Sesión</NavLink>
          </li>
          <li className="flex items-center">
            <ThemeToggle />
          </li>
        </ul>

        {/* Botón hamburguesa para móvil */}
        <button
          className={`navbar-toggle ${
            menuActive ? "active" : ""
          } text-base-content`}
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