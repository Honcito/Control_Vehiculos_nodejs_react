import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia centralizada de Axios
import "../btnControles.css";

const FormularioVehiculos = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    matricula: "",
    num_aparcamiento: "",
    observaciones: "",
    id_propietario: "",
    nombre_propietario: "",
    telefono_propietario: "",
    empresa: "",
  });

  const [propietarios, setPropietarios] = useState([]);

  // Cargar lista de propietarios para el selector
  useEffect(() => {
    api
      .get("/api/propietarios")
      .then((res) => setPropietarios(res.data))
      .catch((err) => {
        console.error("Error al cargar propietarios:", err);
        toast.error("Error al obtener la lista de propietarios");
      });
  }, []);

  // Si estamos editando, cargar los datos del vehículo
  useEffect(() => {
    if (id) {
      api
        .get(`/api/vehiculos/${id}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            matricula: data.matricula || "",
            num_aparcamiento: data.num_aparcamiento ?? "",
            observaciones: data.observaciones || "",
            id_propietario: data.id_propietario ? data.id_propietario.toString() : "",
            nombre_propietario: data.nombre_propietario || "",
            telefono_propietario: data.telefono_propietario || "",
            empresa: data.empresa || "",
          });
        })
        .catch((err) => {
          console.error("Error al cargar vehículo:", err);
          toast.error("Error al obtener los datos del vehículo");
        });
    }
  }, [id]);

  // Autocompletar datos del propietario al cambiar la empresa en el select
  const handleEmpresaChange = (e) => {
    const selectedId = e.target.value;
    const propietario = propietarios.find(
      (p) => p.id_propietario.toString() === selectedId
    );
    setFormData((prev) => ({
      ...prev,
      id_propietario: selectedId,
      empresa: propietario ? propietario.empresa : "",
      nombre_propietario: propietario ? propietario.nombre : "",
      telefono_propietario: propietario ? propietario.telefono : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      matricula: formData.matricula,
      num_aparcamiento: formData.num_aparcamiento,
      observaciones: formData.observaciones,
      id_propietario: formData.id_propietario,
    };

    try {
      if (id) {
        await api.put(`/api/vehiculos/${id}`, body);
        toast.success("Vehículo actualizado correctamente");
      } else {
        await api.post("/api/vehiculos", body);
        toast.success("Vehículo registrado correctamente");
      }
      navigate("/vehiculos");
    } catch (err) {
      console.error("Error al guardar el vehículo:", err);
      toast.error(
        err.response?.data?.error || err.message || "Error al guardar el vehículo"
      );
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-base-100 px-4 py-8 text-base-content">
      <section className="w-full max-w-md bg-base-200 rounded-lg shadow-xl border border-base-300 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {id ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Matrícula */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Matrícula
            </label>
            <input
              type="text"
              name="matricula"
              placeholder="Matrícula del vehículo"
              value={formData.matricula}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Número Aparcamiento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Número de aparcamiento
            </label>
            <input
              type="number"
              name="num_aparcamiento"
              placeholder="Nº de plaza o aparcamiento"
              value={formData.num_aparcamiento}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={0}
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Observaciones
            </label>
            <input
              type="text"
              name="observaciones"
              placeholder="Observaciones adicionales"
              value={formData.observaciones}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Empresa (select) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Empresa
            </label>
            <select
              name="id_propietario"
              value={formData.id_propietario}
              onChange={handleEmpresaChange}
              className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona una empresa</option>
              {propietarios.map((p) => (
                <option key={p.id_propietario} value={p.id_propietario}>
                  {p.empresa}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre propietario (autocompletado, readonly) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Nombre del propietario
            </label>
            <input
              type="text"
              name="nombre_propietario"
              placeholder="Nombre propietario"
              value={formData.nombre_propietario}
              readOnly
              className="w-full px-3 py-2 bg-base-300/50 border border-base-300 rounded-md text-base-content/50 text-sm cursor-not-allowed"
            />
          </div>

          {/* Teléfono propietario (autocompletado, readonly) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content/80">
              Teléfono del propietario
            </label>
            <input
              type="text"
              name="telefono_propietario"
              placeholder="Teléfono propietario"
              value={formData.telefono_propietario}
              readOnly
              className="w-full px-3 py-2 bg-base-300/50 border border-base-300 rounded-md text-base-content/50 text-sm cursor-not-allowed"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={() => navigate("/vehiculos")}
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

export default FormularioVehiculos;