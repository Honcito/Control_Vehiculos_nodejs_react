import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../lib/axios"; // Instancia de Axios centralizada con VITE_API_URL
import "../btnControles.css";

// Obtiene la base URL del entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://hong.sytes.net/api-vehiculos";

const exportarPDF = () => {
  window.open(`${API_BASE_URL}/api/control_vehiculos/exportar_pdf`, "_blank");
};

function ahoraLocalISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d - tzOffset).toISOString().slice(0, 16);
}

const confirmarBorrado = (mensaje) => {
  return new Promise((resolve) => {
    const id = toast(
      (t) => (
        <div>
          <p>{mensaje}</p>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                backgroundColor: "#d33",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: "#aaa",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  });
};

const ControlVehiculos = () => {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matriculaBuscada, setMatriculaBuscada] = useState("");
  const [indexResaltado, setIndexResaltado] = useState(0);
  const [coincidencias, setCoincidencias] = useState([]);

  const filaVacia = () => ({
    cod_control: null,
    matricula: "",
    empresa: "",
    fecha_entrada: "",
    fecha_salida: "",
    observaciones: "",
    num_aparcamiento: "",
    id_usuario: null,
    cod_vehiculo: null,
    esNueva: true,
  });

  const cargarControles = useCallback(
    async (query) => {
      setLoading(true);
      setError(null);

      const currentQuery = query !== undefined ? query : matriculaBuscada;

      try {
        const endpoint = `/api/control_vehiculos${
          currentQuery && currentQuery.length >= 3
            ? `?matricula=${encodeURIComponent(currentQuery)}`
            : ""
        }`;

        // Uso de api (Axios) para garantizar el envío de cookies
        const res = await api.get(endpoint);
        const data = res.data;

        setFilas([...data, filaVacia()]);

        if (currentQuery && currentQuery.length >= 3) {
          const indices = data
            .map((item, i) =>
              item.matricula
                ?.toLowerCase()
                .startsWith(currentQuery.toLowerCase())
                ? i
                : null
            )
            .filter((i) => i !== null);
          setCoincidencias(indices);
          setIndexResaltado(0);
        } else {
          setCoincidencias([]);
          setIndexResaltado(0);
        }
      } catch (e) {
        setError(e.response?.data?.error || e.message || "Error al cargar controles");
      } finally {
        setLoading(false);
      }
    },
    [matriculaBuscada]
  );

  useEffect(() => {
    cargarControles("");
  }, [cargarControles]);

  const resaltarTexto = (texto, termino) => {
    if (!termino) return texto;
    const regex = new RegExp(`(${termino})`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  };

  const handleBuscar = async () => {
    cargarControles(matriculaBuscada);
  };

  const siguienteResaltado = () => {
    if (!coincidencias.length) return;
    setIndexResaltado((prev) => (prev + 1) % coincidencias.length);
  };

  const anteriorResaltado = () => {
    if (!coincidencias.length) return;
    setIndexResaltado(
      (prev) => (prev - 1 + coincidencias.length) % coincidencias.length
    );
  };

  const autocompletarDatos = async (matricula) => {
    if (!matricula || matricula.length < 3) return null;
    try {
      const res = await api.get(
        `/api/control_vehiculos/buscar_matricula?matricula=${encodeURIComponent(matricula)}`
      );
      return res.data;
    } catch {
      return null;
    }
  };

  const handleInputChange = (index, campo, valor) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index][campo] = valor;
    if (campo === "matricula") {
      autocompletarDatos(valor).then((data) => {
        if (data) {
          nuevasFilas[index].empresa = data.empresa;
          nuevasFilas[index].num_aparcamiento = data.num_aparcamiento;
          nuevasFilas[index].cod_vehiculo = data.cod_vehiculo;
        } else {
          nuevasFilas[index].empresa = "";
          nuevasFilas[index].num_aparcamiento = "";
          nuevasFilas[index].cod_vehiculo = null;
        }
        setFilas(nuevasFilas);
      });
    } else {
      setFilas(nuevasFilas);
    }
  };

  const handleFechaClick = (index, campo) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index][campo] = ahoraLocalISO();
    setFilas(nuevasFilas);
  };

  const guardarFila = async (index) => {
    const fila = filas[index];
    try {
      if (fila.esNueva) {
        await api.post("/api/control_vehiculos", fila);
        await cargarControles();
        toast.success("Registro guardado correctamente.");
      } else {
        await api.put(`/api/control_vehiculos/${fila.cod_control}`, fila);
        await cargarControles();
        toast.success("Registro actualizado correctamente.");
      }
    } catch (e) {
      toast.error("Error: " + (e.response?.data?.error || e.message));
    }
  };

  const borrarFila = async (index) => {
    const fila = filas[index];
    if (fila.esNueva) {
      return setFilas(filas.filter((_, i) => i !== index));
    }
    const confirm = await confirmarBorrado(
      `¿Seguro que quieres borrar la fila con matrícula ${fila.matricula}?`
    );
    if (!confirm) return;
    try {
      await api.delete(`/api/control_vehiculos/${fila.cod_control}`);
      await cargarControles();
      toast.success("Fila eliminada correctamente.");
    } catch (e) {
      toast.error("Error: " + (e.response?.data?.error || e.message));
    }
  };

  if (loading) return <p className="p-4">Cargando datos...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4">
      <div className="bg-base-200 rounded-lg shadow-sm">
        <div className="bg-base-500 rounded-t-lg flex items-center justify-between px-4 py-3">
          <h2 className="text-3xl font-bold">Control de Vehículos</h2>
          <button onClick={exportarPDF} className="btn-add mb-4">
            Exportar a PDF
          </button>
          <div className="flex items-center gap-x-2 mb-4">
            <label htmlFor="buscarMatricula" className="font-semibold">
              Buscar Matrícula
            </label>
            <input
              id="buscarMatricula"
              type="text"
              placeholder="Buscar matrícula..."
              value={matriculaBuscada}
              onChange={(e) =>
                setMatriculaBuscada(e.target.value.toUpperCase())
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBuscar();
              }}
              className="border px-2 py-1 rounded text-center"
            />
            <button
              onClick={handleBuscar}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Buscar
            </button>
          </div>
          {coincidencias.length > 0 && (
            <div className="ml-4 flex items-center space-x-2 text-white">
              <button
                onClick={anteriorResaltado}
                className="bg-gray-800 rounded px-2 py-1"
                title="Anterior"
              >
                &lt;
              </button>
              <span>
                {indexResaltado + 1} / {coincidencias.length}
              </span>
              <button
                onClick={siguienteResaltado}
                className="bg-gray-800 rounded px-2 py-1"
                title="Siguiente"
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto bg-base-100 rounded-b-lg p-4">
          <table className="table-controles w-full text-center table table-zebra border-collapse border border-base-300">
            <thead>
              <tr className="h-1 text-xl bg-gray-200 text-black">
                <th className="px-4 py-2 min-w-[100px] border border-base-300">
                  Matrícula
                </th>
                <th className="px-4 py-2 min-w-[120px] border border-base-300">
                  Empresa
                </th>
                <th className="px-4 py-2 min-w-[100px] border border-base-300">
                  Nº Plaza
                </th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">
                  Fecha Salida
                </th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">
                  Fecha Entrada
                </th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">
                  Observaciones
                </th>
                <th className="px-4 py-2 min-w-[140px] border border-base-300">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-base-100 divide-y divide-base-700 text-lg font-bold">
              {filas.map((fila, i) => {
                const matriculaHTML = fila.matricula
                  ? resaltarTexto(fila.matricula, matriculaBuscada)
                  : "";
                const esResaltado = coincidencias[indexResaltado] === i;

                return (
                  <tr
                    key={fila.cod_control ?? `nueva-${i}`}
                    className={`hover:bg-base-300 ${
                      esResaltado ? "bg-yellow-300" : ""
                    }`}
                  >
                    <td className="border border-base-300 px-2 py-2 min-w-[120px]">
                      {fila.esNueva ? (
                        <input
                          type="text"
                          value={fila.matricula}
                          onChange={(e) =>
                            handleInputChange(
                              i,
                              "matricula",
                              e.target.value.toUpperCase()
                            )
                          }
                          className="w-24 px-2 py-1 border border-base-300 rounded text-center"
                          autoFocus
                        />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{ __html: matriculaHTML }}
                        />
                      )}
                    </td>
                    <td className="border border-base-300 px-4 py-2 min-w-[220px]">
                      <input
                        type="text"
                        value={fila.empresa}
                        disabled
                        className="w-68 px-2 py-1 border border-base-300 rounded bg-base-200 text-base-content text-center"
                      />
                    </td>
                    <td className="border border-base-300 px-4 py-2">
                      <input
                        type="number"
                        value={fila.num_aparcamiento}
                        disabled
                        className="px-2 py-1 border border-base-300 rounded bg-base-200 cursor-not-allowed text-center font-extrabold"
                      />
                    </td>
                    <td className="border border-base-300 px-4 py-2">
                      <input
                        type="datetime-local"
                        value={fila.fecha_salida}
                        onClick={() => handleFechaClick(i, "fecha_salida")}
                        onChange={(e) =>
                          handleInputChange(i, "fecha_salida", e.target.value)
                        }
                        className="px-2 py-1 border border-base-400 rounded text-center text-lg"
                      />
                    </td>
                    <td className="border border-base-300 px-4 py-2">
                      <input
                        type="datetime-local"
                        value={fila.fecha_entrada}
                        onClick={() => handleFechaClick(i, "fecha_entrada")}
                        onChange={(e) =>
                          handleInputChange(i, "fecha_entrada", e.target.value)
                        }
                        className="px-2 py-1 border border-base-400 rounded text-center"
                      />
                    </td>
                    <td className="border border-base-300 px-4 py-2">
                      <textarea
                        value={fila.observaciones}
                        onChange={(e) =>
                          handleInputChange(i, "observaciones", e.target.value)
                        }
                        className="px-2 py-1 border border-base-400 rounded resize-y overflow-auto min-h-[32px]"
                        rows="1"
                      />
                    </td>
                    <td className="border border-base-300 px-4 py-2 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => guardarFila(i)}
                        className="btn-update px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {fila.esNueva ? "Guardar" : "Actualizar"}
                      </button>
                      <button
                        onClick={() => borrarFila(i)}
                        className="btn-delete px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot
              className="bg-white text-black"
              style={{ position: "sticky", bottom: 0, zIndex: 10 }}
            >
              <tr className="h-1 text-xl">
                <th className="px-4 py-2 min-w-[100px] border border-base-300">
                  Matrícula
                </th>
                <th className="px-4 py-2 min-w-[120px] border border-base-300">
                  Empresa
                </th>
                <th className="px-4 py-2 min-w-[100px] border border-base-300">
                  Nº Plaza
                </th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">
                  Fecha Salida
                </th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">
                  Fecha Entrada
                </th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">
                  Observaciones
                </th>
                <th className="px-4 py-2 min-w-[140px] border border-base-300">
                  Acciones
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default ControlVehiculos;