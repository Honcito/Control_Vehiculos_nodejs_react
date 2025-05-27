import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../navbar.css";
import logo from "/images/GrasalvaLogo.JPEG";
import { Moon } from 'lucide-react';
import { Sun } from 'lucide-react';

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
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/propietarios"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Propietarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vehiculos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Vehículos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/usuarios"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/control_vehiculos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Control de Vehículos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Cerrar Sesión
            </NavLink>
          </li>
          <li>
            <Sun />
          </li>
          <li>
            <Moon />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
