import React, { useEffect, useState } from "react";
import "../btnControles.css";

const API_BASE = "http://localhost:3000/api/control_vehiculos";
const API_EXPORT_PDF = "http://localhost:3000/api/control_vehiculos/exportar_pdf";

const exportarPDF = async () => {
  try {
    const res = await fetch(API_EXPORT_PDF, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error al generar el PDF");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "control_vehiculos.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("No se pudo descargar el PDF: " + error.message);
  }
};

function ahoraLocalISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d - tzOffset).toISOString().slice(0, 16);
  return localISO;
}

const ControlVehiculos = () => {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarControles();
  }, []);

  const cargarControles = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        credentials: "include",
      });
      const text = await res.text();
      if (!res.ok) throw new Error("Error al cargar controles");
      const data = JSON.parse(text);
      setFilas([...data, filaVacia()]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

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

  const autocompletarDatos = async (matricula) => {
    if (!matricula || matricula.length < 6) return null;
    try {
      const res = await fetch(`${API_BASE}/buscar_matricula?matricula=${encodeURIComponent(matricula)}`, {
        credentials: "include",
      });
      const texto = await res.text();
      if (texto.startsWith("{") || texto.startsWith("[")) {
        return JSON.parse(texto);
      } else {
        return null;
      }
    } catch (error) {
      return null;
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
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(fila),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al crear registro");
        }
        const data = await res.json();
        const nuevasFilas = [...filas];
        nuevasFilas[index].cod_control = data.controlId;
        nuevasFilas[index].esNueva = false;
        setFilas([...nuevasFilas, filaVacia()]);
      } else {
        const res = await fetch(`${API_BASE}/${fila.cod_control}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(fila),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al actualizar registro");
        }
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const borrarFila = async (index) => {
    const fila = filas[index];
    if (fila.esNueva) {
      setFilas(filas.filter((_, i) => i !== index));
      return;
    }
    if (!window.confirm("¿Seguro que quieres borrar esta fila?")) return;

    try {
      const res = await fetch(`${API_BASE}/${fila.cod_control}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al borrar registro");
      }
      setFilas(filas.filter((_, i) => i !== index));
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4">
      <div className="bg-base-200 rounded-lg shadow-sm">
        <div className="bg-base-500 rounded-t-lg flex items-center justify-between px-4 py-3">
          <h2 className="text-3xl font-bold">Control de Vehículos</h2>
          <button
            onClick={exportarPDF}
            className="btn-add"
            style={{ marginBottom: "1rem" }}
          >
            Exportar a PDF
          </button>
        </div>
        <div className="overflow-x-auto bg-base-100 rounded-b-lg p-4">
          <table className="table-controles w-full text-lg text-center table table-zebra border-collapse border border-base-300">
            <thead className="bg-white text-black sticky top-0 z-10">
              <tr className="h-12 text-lg">
                <th className="px-4 py-2 min-w-[100px] border border-base-300">Matrícula</th>
                <th className="px-4 py-2 min-w-[120px] border border-base-300">Empresa</th>
                <th className="px-4 py-2 min-w-[100px] border border-base-300">Nº Aparcamiento</th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">Fecha Salida</th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">Fecha Entrada</th>
                <th className="px-4 py-2 min-w-[160px] border border-base-300">Observaciones</th>
                <th className="px-4 py-2 min-w-[140px] border border-base-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-700 text-base font-semibold">
              {filas.map((fila, i) => (
                <tr key={fila.cod_control ?? `nueva-${i}`} className="hover:bg-base-300">
                  <td className="border border-base-300 px-4 py-2">
                    <input
                      type="text"
                      value={fila.matricula || ""}
                      onChange={(e) => handleInputChange(i, "matricula", e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 border border-base-400 rounded text-center uppercase"
                    />
                  </td>
                  <td className="border border-base-300 px-4 py-2">
                    <input
                      type="text"
                      value={fila.empresa || ""}
                      disabled
                      className="px-2 py-1 border border-base-300 rounded bg-base-200 text-base-content text-center"
                    />
                  </td>
                  <td className="border border-base-300 px-4 py-2">
                    <input
                      type="number"
                      value={fila.num_aparcamiento || ""}
                      disabled
                      className="px-2 py-1 border border-base-300 rounded bg-base-200 cursor-not-allowed text-center"
                    />
                  </td>
                  <td className="border border-base-300 px-4 py-2">
                    <input
                      type="datetime-local"
                      value={fila.fecha_salida || ""}
                      onClick={() => handleFechaClick(i, "fecha_salida")}
                      onChange={(e) => handleInputChange(i, "fecha_salida", e.target.value)}
                      className="px-2 py-1 border border-base-400 rounded text-center"
                    />
                  </td>
                  <td className="border border-base-300 px-4 py-2">
                    <input
                      type="datetime-local"
                      value={fila.fecha_entrada || ""}
                      onClick={() => handleFechaClick(i, "fecha_entrada")}
                      onChange={(e) => handleInputChange(i, "fecha_entrada", e.target.value)}
                      className="px-2 py-1 border border-base-400 rounded text-center"
                    />
                  </td>
                  <td className="border border-base-300 px-4 py-2">
                    <textarea
                      value={fila.observaciones}
                      onChange={(e) => handleInputChange(i, "observaciones", e.target.value)}
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
                    {!fila.esNueva && (
                      <button
                        onClick={() => borrarFila(i)}
                        className="btn-delete px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Borrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filas.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-base-content opacity-50">
                    No hay registros.
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

export default ControlVehiculos;
