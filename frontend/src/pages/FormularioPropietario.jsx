import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia de Axios centralizada
import "../btnControles.css";

const FormularioPropietario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    empresa: "",
    nombre: "",
    num_plazas: "",
    telefono: "",
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/api/propietarios/${id}`)
        .then((res) => setFormData(res.data))
        .catch(() => toast.error("Error al cargar propietario"));
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
        await api.put(`/api/propietarios/${id}`, formData);
        toast.success("Propietario actualizado");
      } else {
        await api.post("/api/propietarios", formData);
        toast.success("Propietario creado");
      }
      navigate("/propietarios");
    } catch (err) {
      console.error("Error en el formulario:", err);
      toast.error(err.response?.data?.error || err.message || "Error al guardar");
    }
  };

  const handleDelete = () => {
    if (!id) return;

    const toastId = toast(
      (t) => (
        <div className="bg-base-200 text-base-content p-4 rounded shadow space-y-4 max-w-xs border border-base-300">
          <p className="text-sm">¿Seguro que quieres eliminar este propietario?</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 text-sm rounded bg-base-300 hover:bg-base-100 transition-colors"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancelar
            </button>
            <button
              className="btn-delete"
              onClick={async () => {
                toast.loading("Eliminando...", { id: toastId });
                try {
                  await api.delete(`/api/propietarios/${id}`);
                  toast.success("Propietario eliminado", { id: toastId });
                  navigate("/propietarios");
                } catch (err) {
                  toast.error(
                    err.response?.data?.error || err.message || "Error al eliminar",
                    { id: toastId }
                  );
                }
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-base-100 px-4 py-8 text-base-content">
      <section className="w-full max-w-md bg-base-200 rounded-lg shadow-xl border border-base-300 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {id ? "Editar Propietario" : "Nuevo Propietario"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Empresa */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Empresa
            </label>
            <input
              type="text"
              name="empresa"
              placeholder="Nombre de la empresa"
              value={formData.empresa}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de contacto"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Nº plazas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Nº de plazas
            </label>
            <input
              type="number"
              name="num_plazas"
              placeholder="Nº de plazas alquiladas"
              value={formData.num_plazas || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Teléfono/s */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Teléfono/s
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

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={() => navigate("/propietarios")}
              className="px-4 py-2 bg-base-300 hover:bg-base-100 text-base-content text-sm font-semibold rounded-md transition-colors"
            >
              Volver
            </button>

            {id && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-delete"
              >
                Eliminar
              </button>
            )}

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

export default FormularioPropietario;