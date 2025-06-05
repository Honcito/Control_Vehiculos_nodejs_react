import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import logo from "/images/GrasalvaLogo.JPEG";
import "../navbar.css";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { user } = useContext(AuthContext); // Acceso al usuario desde contexto

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/home" className="navbar-logo">
          <img src={logo} alt="Logo Grasalva" />
        </a>
        <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
          <li className="navbar-menu">
            <NavLink to="/home">Inicio</NavLink>
          </li>
        </ul>
        <button
          className={`navbar-toggle ${
            menuActive ? "active" : ""
          } text-base-content`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
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
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
