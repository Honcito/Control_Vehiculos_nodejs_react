import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia de Axios centralizada

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
          // Aseguramos que no existan valores null/undefined en las propiedades del formulario
          setFormData({
            nombre: res.data.nombre || "",
            password: "", // La contraseña habitualmente se deja vacía al editar por seguridad
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
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6">
      <section className="w-full max-w-sm min-h-[550px] bg-gray-900 rounded-lg shadow-xl p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {id ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
        </div>
        <br />
        <form onSubmit={handleSubmit} className="space-y-4">
          <br />
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Nombre:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
            />
          </div>
          <br />
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Contraseña:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="password"
              name="password"
              placeholder={id ? "Dejar en blanco para no cambiar" : "Contraseña"}
              value={formData.password}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required={!id}
            />
          </div>
          <br />
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Teléfono:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
            />
          </div>
          <br />
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Rol:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="ROLE_ADMIN">Administrador</option>
              <option value="ROLE_USER">Usuario</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="btn-update">
              {id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default FormularioUsuarios;