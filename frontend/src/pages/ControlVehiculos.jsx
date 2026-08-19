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
    return texto.replace(regex, "<mark class='bg-yellow-300 text-black px-1 rounded'>$1</mark>");
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

  if (loading) return <p className="p-6 text-base-content text-lg">Cargando datos...</p>;
  if (error) return <p className="p-6 text-red-400 text-lg">Error: {error}</p>;

  return (
    <div className="w-full text-base-content">
      <div className="bg-base-200 rounded-lg shadow-xl border border-base-300 overflow-hidden">
        
        {/* Cabecera / Barra de Controles */}
        <div className="p-6 border-b border-base-300 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Control de Vehículos</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportarPDF}
              className="btn-delete"
            >
              Exportar a PDF
            </button>

            <div className="flex items-center gap-2">
              <input
                id="buscarMatricula"
                type="text"
                placeholder="Buscar matrícula..."
                value={matriculaBuscada}
                onChange={(e) => setMatriculaBuscada(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                className="px-3 py-1.5 text-base bg-base-100 text-base-content border border-base-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
              <button
                onClick={handleBuscar}
                className="btn-add"
              >
                Buscar
              </button>
            </div>

            {coincidencias.length > 0 && (
              <div className="flex items-center space-x-2 text-sm bg-base-100 px-3 py-1.5 rounded border border-base-300">
                <button
                  onClick={anteriorResaltado}
                  className="px-2 py-0.5 bg-base-300 hover:bg-base-200 rounded"
                  title="Anterior"
                >
                  &lt;
                </button>
                <span>
                  {indexResaltado + 1} / {coincidencias.length}
                </span>
                <button
                  onClick={siguienteResaltado}
                  className="px-2 py-0.5 bg-base-300 hover:bg-base-200 rounded"
                  title="Siguiente"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabla principal con la clase CSS table-controles */}
        <div className="overflow-x-auto p-4">
          <table className="table-controles w-full text-center border-collapse border border-base-300">
            <thead>
              <tr className="bg-base-300 text-base-content text-base">
                <th className="px-4 py-3 border border-base-300 min-w-[120px]">Matrícula</th>
                <th className="px-4 py-3 border border-base-300 min-w-[180px]">Empresa</th>
                <th className="px-4 py-3 border border-base-300 min-w-[100px]">Nº Plaza</th>
                <th className="px-4 py-3 border border-base-300 min-w-[170px]">Fecha Salida</th>
                <th className="px-4 py-3 border border-base-300 min-w-[170px]">Fecha Entrada</th>
                <th className="px-4 py-3 border border-base-300 min-w-[200px]">Observaciones</th>
                <th className="px-4 py-3 border border-base-300 min-w-[160px]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-300 text-sm font-medium">
              {filas.map((fila, i) => {
                const matriculaHTML = fila.matricula
                  ? resaltarTexto(fila.matricula, matriculaBuscada)
                  : "";
                const esResaltado = coincidencias[indexResaltado] === i;

                return (
                  <tr
                    key={fila.cod_control ?? `nueva-${i}`}
                    className={`transition-colors ${
                      esResaltado
                        ? "bg-yellow-500/20"
                        : i % 2 === 0
                        ? "bg-base-100"
                        : "bg-base-200/50"
                    }`}
                  >
                    <td className="border border-base-300 px-3 py-2">
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
                          className="w-28 text-center font-semibold"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="font-bold text-base"
                          dangerouslySetInnerHTML={{ __html: matriculaHTML }}
                        />
                      )}
                    </td>
                    <td className="border border-base-300 px-3 py-2">
                      <input
                        type="text"
                        value={fila.empresa}
                        disabled
                        className="w-full text-center"
                      />
                    </td>
                    <td className="border border-base-300 px-3 py-2">
                      <input
                        type="number"
                        value={fila.num_aparcamiento}
                        disabled
                        className="text-center font-bold"
                      />
                    </td>
                    <td className="border border-base-300 px-3 py-2">
                      <input
                        type="datetime-local"
                        value={fila.fecha_salida}
                        onClick={() => handleFechaClick(i, "fecha_salida")}
                        onChange={(e) =>
                          handleInputChange(i, "fecha_salida", e.target.value)
                        }
                        className="text-center"
                      />
                    </td>
                    <td className="border border-base-300 px-3 py-2">
                      <input
                        type="datetime-local"
                        value={fila.fecha_entrada}
                        onClick={() => handleFechaClick(i, "fecha_entrada")}
                        onChange={(e) =>
                          handleInputChange(i, "fecha_entrada", e.target.value)
                        }
                        className="text-center"
                      />
                    </td>
                    <td className="border border-base-300 px-3 py-2">
                      <textarea
                        value={fila.observaciones}
                        onChange={(e) =>
                          handleInputChange(i, "observaciones", e.target.value)
                        }
                        className="w-full"
                        rows="1"
                      />
                    </td>
                    <td className="border border-base-300 px-3 py-2">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => guardarFila(i)}
                          className={fila.esNueva ? "btn-add" : "btn-update"}
                        >
                          {fila.esNueva ? "Guardar" : "Actualizar"}
                        </button>
                        <button
                          onClick={() => borrarFila(i)}
                          className="btn-delete"
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot className="bg-base-300 text-base-content sticky bottom-0 z-10 border-t border-base-300">
              <tr className="text-sm font-semibold">
                <th className="px-4 py-2 border border-base-300">Matrícula</th>
                <th className="px-4 py-2 border border-base-300">Empresa</th>
                <th className="px-4 py-2 border border-base-300">Nº Plaza</th>
                <th className="px-4 py-2 border border-base-300">Fecha Salida</th>
                <th className="px-4 py-2 border border-base-300">Fecha Entrada</th>
                <th className="px-4 py-2 border border-base-300">Observaciones</th>
                <th className="px-4 py-2 border border-base-300">Acciones</th>
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