import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../btn.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ nombre, password });

      if (result.success) {
        toast.success("¡Bienvenido/a de nuevo!");
        navigate("/home");
      } else {
        toast.error(result.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      toast.error("Ocurrió un error inesperado al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4 py-8 text-base-content">
      <section className="w-full max-w-md bg-base-200 rounded-lg shadow-xl p-8 border border-base-300 space-y-6">
        
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-base-content">
            Control de Vehículos
          </h2>
          <p className="text-sm text-base-content/70">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div className="flex flex-col text-left space-y-1.5">
            <label className="text-sm font-medium text-base-content">
              Nombre:
            </label>
            <input
              className="w-full h-11 px-4 text-base bg-base-100 border border-base-300 rounded text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu usuario"
              disabled={loading}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col text-left space-y-1.5">
            <label className="text-sm font-medium text-base-content">
              Contraseña:
            </label>
            <input
              className="w-full h-11 px-4 text-base bg-base-100 border border-base-300 rounded text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {/* Botón Iniciar Sesión */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-login w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>

          {/* Enlace a Registro */}
          <div className="text-center pt-2">
            <Link
              to="/register"
              className="text-sm text-primary hover:underline transition-colors"
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