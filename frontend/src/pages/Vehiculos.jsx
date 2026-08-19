import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia centralizada de Axios
import "../btn.css";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/vehiculos")
      .then((res) => {
        setVehiculos(res.data);
      })
      .catch((error) => {
        console.error("Error cargando vehículos:", error);
        toast.error("Error al obtener la lista de vehículos");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (id) => {
    navigate(`/vehiculos/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este vehículo?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/vehiculos/${id}`);
      setVehiculos((prev) => prev.filter((v) => v.cod_vehiculo !== id));
      toast.success("Vehículo eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando vehículo:", error);
      toast.error(
        error.response?.data?.message || "Error al eliminar el vehículo"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white px-8 py-6">
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700 space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-white">Lista de Vehículos</h2>
          <button
            className="btn-add"
            onClick={() => navigate("/vehiculos/nuevo")}
          >
            Añadir Vehículo
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-center divide-y divide-gray-700">
            <thead className="bg-gray-800 text-gray-200 capitalize sticky top-0 z-10">
              <tr className="h-12 text-sm md:text-base font-semibold">
                <th className="px-4 py-3 min-w-[80px]">ID</th>
                <th className="px-4 py-3 min-w-[120px]">Matrícula</th>
                <th className="px-4 py-3 min-w-[100px]">Nº Plaza</th>
                <th className="px-4 py-3 min-w-[150px]">Observaciones</th>
                <th className="px-4 py-3 min-w-[120px]">Empresa</th>
                <th className="px-4 py-3 min-w-[120px]">Propietario</th>
                <th className="px-4 py-3 min-w-[120px]">Teléfono</th>
                <th className="px-4 py-3 min-w-[150px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800 text-sm md:text-base font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    Cargando vehículos...
                  </td>
                </tr>
              ) : vehiculos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    No hay vehículos registrados.
                  </td>
                </tr>
              ) : (
                vehiculos.map((v) => (
                  <tr
                    key={v.cod_vehiculo}
                    className="hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="px-4 py-3">{v.cod_vehiculo}</td>
                    <td className="px-4 py-3 font-semibold">{v.matricula || "-"}</td>
                    <td className="px-4 py-3">{v.num_aparcamiento ?? "-"}</td>
                    <td className="px-4 py-3">{v.observaciones || "-"}</td>
                    <td className="px-4 py-3">
                      {v.propietario?.empresa || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {v.propietario?.nombre || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {v.propietario?.telefono || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditar(v.cod_vehiculo)}
                          className="btn-update"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(v.cod_vehiculo)}
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

export default Vehiculos;