import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../btn.css";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/vehiculos", {
      method: "GET",
      credentials: "include", // para enviar cookies de sesión
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        //console.log("Respuesta del backend:", data);
        setVehiculos(data);
      })
      .catch((error) => console.error("Error cargando vehículos:", error));
  }, []);

  const handleEditar = (id) => {
    navigate(`/vehiculos/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este vehículo?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3000/api/vehiculos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setVehiculos(vehiculos.filter((p) => p.cod_vehiculo !== id));
    } catch (error) {
      console.error("Error eliminando vehículo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="bg-base-200 rounded-lg shadow-sm">
        <div className="bg-base-500 rounded flex place-items-center justify-between px-4 py-3">
          <h2 className="text-3xl font-bold">Lista de Vehículos</h2>
          <button
            className="btn-add"
            onClick={() => navigate("/vehiculos/nuevo")}
          >
            Añadir Vehículo
          </button>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="w-full text-lg text-center table table-zebra">
            <thead className="bg-white text-black capitalize sticky top-0 z-10">
              <tr className="h-12 text-lg">
                <th className="px-4 py-2 min-w-[80px] text-center">ID</th>
                <th className="px-4 py-2 min-w-[120px] text-center">
                  Matrícula
                </th>
                <th className="px-4 py-2 min-w-[100px] text-center">
                  Nº Plaza
                </th>
                <th className="px-4 py-2 min-w-[150px] text-center">
                  Observaciones
                </th>
                <th className="px-4 py-2 min-w-[120px] text-center">Empresa</th>
                <th className="px-4 py-2 min-w-[120px] text-center">
                  Propietario
                </th>
                <th className="px-4 py-2 min-w-[120px] text-center">
                  Teléfono
                </th>
                <th className="px-4 py-2 min-w-[150px] text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-700 text-base font-semibold">
              {vehiculos.map((prop) => (
                <tr key={prop.cod_vehiculo} className="hover:bg-base-300">
                  <td className="px-4 py-2">{prop.cod_vehiculo}</td>
                  <td className="px-4 py-2">{prop.matricula}</td>
                  <td className="px-4 py-2">{prop.num_aparcamiento}</td>
                  <td className="px-4 py-2">{prop.observaciones}</td>
                  <td className="px-4 py-2">
                    {prop.propietario?.empresa || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {prop.propietario?.nombre || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {prop.propietario?.telefono || "-"}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditar(prop.cod_vehiculo)}
                      className="btn-update"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(prop.cod_vehiculo)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {vehiculos.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-base-content opacity-50"
                  >
                    No hay vehículos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vehiculos;
