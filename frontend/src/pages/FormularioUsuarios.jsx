import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia de Axios centralizada
import "../btnControles.css";

const FormularioUsuarios = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    rol: "",
    telefono: "",
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/api/usuarios/${id}`)
        .then((res) => {
          setFormData({
            nombre: res.data.nombre || "",
            password: "", // Contraseña vacía por seguridad en edición
            rol: res.data.rol || "",
            telefono: res.data.telefono || "",
          });
        })
        .catch((err) => {
          console.error("Error al cargar usuario:", err);
          toast.error("Error al obtener los datos del usuario");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await api.put(`/api/usuarios/${id}`, formData);
        toast.success("Usuario actualizado correctamente");
      } else {
        await api.post("/api/usuarios", formData);
        toast.success("Usuario creado correctamente");
      }
      navigate("/usuarios");
    } catch (err) {
      console.error("Error en el formulario:", err);
      toast.error(
        err.response?.data?.error || err.message || "Error al guardar el usuario"
      );
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-base-100 px-4 py-8 text-base-content">
      <section className="w-full max-w-md bg-base-200 rounded-lg shadow-xl border border-base-300 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {id ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del usuario"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder={id ? "Dejar en blanco para no cambiar" : "Contraseña"}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!id}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              placeholder="Número de teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="ROLE_ADMIN">Administrador</option>
              <option value="ROLE_USER">Usuario</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={() => navigate("/usuarios")}
              className="px-4 py-2 bg-base-300 hover:bg-base-100 text-base-content text-sm font-semibold rounded-md transition-colors"
            >
              Volver
            </button>

            <button
              type="submit"
              className={id ? "btn-update" : "btn-add"}
            >
              {id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default FormularioUsuarios;