import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia centralizada de Axios
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
    <div className="min-h-dvh w-full flex items-center justify-center bg-gray-800 px-6 py-12">
      <section className="w-full max-w-md min-h-[550px] flex flex-col justify-center bg-gray-900 rounded-lg shadow-xl p-10 space-y-6 border border-gray-700">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">
            Registro de Empleados
          </h2>
          <p className="text-base text-gray-400">
            Crea una cuenta para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div className="flex flex-col items-center">
            <label className="w-72 text-base font-medium text-white mb-2 text-left">
              Nombre de usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: juanperez"
              className="w-72 h-11 px-4 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded text-gray-800"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col items-center">
            <label className="w-72 text-base font-medium text-white mb-2 text-left">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-72 h-11 px-4 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded text-gray-800"
            />
          </div>

          {/* Campo Teléfono */}
          <div className="flex flex-col items-center">
            <label className="w-72 text-base font-medium text-white mb-2 text-left">
              Teléfono <span className="text-gray-400 text-xs">(Opcional)</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 600123456"
              className="w-72 h-11 px-4 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded text-gray-800"
            />
          </div>

          {/* Botón Registro */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-login w-72 h-11 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          {/* Enlace a Login */}
          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors bg-transparent border-0 cursor-pointer"
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;