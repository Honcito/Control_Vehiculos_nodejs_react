import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import "../btn.css";

const Login = () => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", { nombre, password });
      toast.success("¡Bienvenido!");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/home");
    } catch (err) {
      console.error("Error en login:", err);
      toast.error(
        err.response?.data?.message || "Credenciales incorrectas o error en el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4 py-8 text-base-content">
      <section className="w-full max-w-md bg-base-200 rounded-xl shadow-2xl p-8 border border-base-300 space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-base-content">
            Control de Vehículos
          </h2>
          <p className="text-sm text-base-content/70">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Usuario */}
          <div className="flex flex-col text-left space-y-1.5">
            <label className="text-sm font-semibold text-base-content">
              Nombre de usuario:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu usuario"
              className="w-full h-11 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col text-left space-y-1.5">
            <label className="text-sm font-semibold text-base-content">
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full h-11 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Botón Login */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-login w-full h-11 disabled:opacity-50 text-base font-bold rounded-lg transition-all"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>

          {/* Enlace a Registro */}
          <div className="text-center pt-2">
            <Link
              to="/register"
              className="text-sm text-emerald-500 hover:text-emerald-400 hover:underline transition-colors font-medium"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;