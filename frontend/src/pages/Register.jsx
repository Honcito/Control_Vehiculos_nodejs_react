import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.password) {
      toast.error("Los campos nombre y contraseña son obligatorios");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", formData);
      toast.success("Registro exitoso. Redirigiendo a inicio de sesión...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Error en registro:", err);
      toast.error(
        err.response?.data?.message || "Error al registrar el usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4 py-12">
      <section 
        className="w-full max-w-md bg-base-200 rounded-2xl shadow-2xl border border-base-300"
        style={{ padding: "40px 32px", minHeight: "580px" }}
      >
        {/* Encabezado */}
        <div className="text-center" style={{ marginBottom: "32px" }}>
          <h2 className="text-3xl font-extrabold text-base-content" style={{ marginBottom: "8px" }}>
            Registro de Empleados
          </h2>
          <p className="text-sm text-base-content/70">
            Crea una cuenta para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Campo Nombre */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="text-sm font-semibold text-base-content">
              Nombre de usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: juanperez"
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              style={{ height: "48px", paddingLeft: "16px", paddingRight: "16px", fontSize: "15px" }}
            />
          </div>

          {/* Campo Contraseña */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="text-sm font-semibold text-base-content">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              style={{ height: "48px", paddingLeft: "16px", paddingRight: "16px", fontSize: "15px" }}
            />
          </div>

          {/* Campo Teléfono */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="text-sm font-semibold text-base-content">
              Teléfono <span className="text-base-content/50 text-xs font-normal">(Opcional)</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 600123456"
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              style={{ height: "48px", paddingLeft: "16px", paddingRight: "16px", fontSize: "15px" }}
            />
          </div>

          {/* Botón Registro */}
          <div style={{ marginTop: "8px" }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          {/* Enlace a Login */}
          <div className="text-center" style={{ marginTop: "8px" }}>
            <Link
              to="/login"
              className="text-sm text-emerald-500 hover:text-emerald-400 hover:underline transition-colors font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;