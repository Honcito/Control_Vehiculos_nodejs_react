import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import "../btn.css";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100 px-4 py-8 text-base-content">
      <section className="w-full max-w-md bg-base-200 rounded-xl shadow-2xl p-8 border border-base-300 space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-base-content">
            Registro de Empleados
          </h2>
          <p className="text-sm text-base-content/70">
            Crea una cuenta para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div className="flex flex-col text-left space-y-1.5">
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
              className="w-full h-11 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col text-left space-y-1.5">
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
              className="w-full h-11 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Campo Teléfono */}
          <div className="flex flex-col text-left space-y-1.5">
            <label className="text-sm font-semibold text-base-content">
              Teléfono <span className="text-base-content/50 text-xs font-normal">(Opcional)</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 600123456"
              className="w-full h-11 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Botón Registro */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-login w-full h-11 disabled:opacity-50 text-base font-bold rounded-lg transition-all"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          {/* Enlace a Login */}
          <div className="text-center pt-2">
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