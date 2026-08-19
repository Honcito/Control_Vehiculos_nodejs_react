import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia centralizada de Axios
import "../btn.css";

const Propietarios = () => {
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/propietarios")
      .then((res) => {
        setPropietarios(res.data);
      })
      .catch((error) => {
        console.error("Error cargando propietarios:", error);
        toast.error("Error al obtener la lista de propietarios");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (id) => {
    navigate(`/propietarios/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este propietario?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/propietarios/${id}`);
      setPropietarios((prev) =>
        prev.filter((p) => p.id_propietario !== id)
      );
      toast.success("Propietario eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando propietario:", error);
      toast.error(
        error.response?.data?.error || "Error al eliminar el propietario"
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-8 py-6">
      <div className="bg-base-200 rounded-lg shadow-xl p-6 border border-base-300 space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 pb-4">
          <h2 className="text-3xl font-bold text-base-content">
            Lista de Propietarios
          </h2>
          <button
            className="btn-add"
            onClick={() => navigate("/propietarios/nuevo")}
          >
            Añadir Propietario
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-base-300">
          <table className="w-full text-center divide-y divide-base-300">
            <thead className="bg-base-300 text-base-content capitalize sticky top-0 z-10">
              <tr className="h-12 text-sm md:text-base font-semibold">
                <th className="px-4 py-3 min-w-[80px]">ID</th>
                <th className="px-4 py-3 min-w-[120px]">Empresa</th>
                <th className="px-4 py-3 min-w-[120px]">Nombre</th>
                <th className="px-4 py-3 min-w-[100px]">Nº Plazas</th>
                <th className="px-4 py-3 min-w-[120px]">Teléfono</th>
                <th className="px-4 py-3 min-w-[150px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-base-200 divide-y divide-base-300 text-sm md:text-base font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-base-content/60">
                    Cargando propietarios...
                  </td>
                </tr>
              ) : propietarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-base-content/60">
                    No hay propietarios registrados.
                  </td>
                </tr>
              ) : (
                propietarios.map((prop) => (
                  <tr
                    key={prop.id_propietario}
                    className="hover:bg-base-300/50 transition-colors"
                  >
                    <td className="px-4 py-3">{prop.id_propietario}</td>
                    <td className="px-4 py-3">{prop.empresa || "-"}</td>
                    <td className="px-4 py-3">{prop.nombre || "-"}</td>
                    <td className="px-4 py-3">{prop.num_aparcamiento ?? "-"}</td>
                    <td className="px-4 py-3">{prop.telefono || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditar(prop.id_propietario)}
                          className="btn-update"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(prop.id_propietario)}
                          className="btn-delete"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Propietarios;