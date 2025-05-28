import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "/images/GrasalvaLogo.JPEG";
import "../navbar.css";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Logo Grasalva" />
        </a>

        <button
          className={`navbar-toggle ${menuActive ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
          <li><NavLink to="/">Inicio</NavLink></li>
          <li><NavLink to="/propietarios">Propietarios</NavLink></li>
          <li><NavLink to="/vehiculos">Vehículos</NavLink></li>
          <li><NavLink to="/usuarios">Usuarios</NavLink></li>
          <li><NavLink to="/control_vehiculos">Control de Vehículos</NavLink></li>
          <li><NavLink to="/logout">Cerrar Sesión</NavLink></li>
          <li><ThemeToggle /></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
