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
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6 py-10">
      <section className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Registro de Empleados
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Crea una cuenta para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Nombre de usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: juanperez"
              className="w-full px-4 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Teléfono <span className="text-gray-400 text-xs">(Opcional)</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 600123456"
              className="w-full px-4 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-login flex justify-center items-center py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-400 hover:underline bg-transparent border-0 cursor-pointer"
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