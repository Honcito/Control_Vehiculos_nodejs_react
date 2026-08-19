import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4 py-12">
      <section 
        className="w-full max-w-md bg-base-200 rounded-2xl shadow-2xl border border-base-300"
        style={{ padding: "40px 32px", minHeight: "520px" }}
      >
        {/* Encabezado */}
        <div className="text-center" style={{ marginBottom: "32px" }}>
          <h2 className="text-3xl font-extrabold text-base-content" style={{ marginBottom: "8px" }}>
            Control de Vehículos
          </h2>
          <p className="text-sm text-base-content/70">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Campo Usuario */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="text-sm font-semibold text-base-content">
              Nombre de usuario:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Introduce la palabra: USUARIO"
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              style={{ height: "48px", paddingLeft: "16px", paddingRight: "16px", fontSize: "15px" }}
            />
          </div>

          {/* Campo Contraseña */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="text-sm font-semibold text-base-content">
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Introduce contraseña: USUARIO"
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              style={{ height: "48px", paddingLeft: "16px", paddingRight: "16px", fontSize: "15px" }}
            />
          </div>

          {/* Botón Login */}
          <div style={{ marginTop: "8px" }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>

          {/* Enlace a Registro */}
          <div className="text-center" style={{ marginTop: "8px" }}>
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