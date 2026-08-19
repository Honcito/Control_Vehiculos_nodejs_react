import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia centralizada de Axios

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
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6">
      <section className="w-full max-w-sm min-h-[550px] bg-gray-900 rounded-lg shadow-xl p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {id ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h2>
        </div>
        <br />
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Matrícula */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Matrícula:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="matricula"
              placeholder="Matrícula"
              value={formData.matricula}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
            />
          </div>

          {/* Número Aparcamiento */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Número de aparcamiento:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="number"
              name="num_aparcamiento"
              placeholder="Número de aparcamiento"
              value={formData.num_aparcamiento}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
              min={0}
            />
          </div>

          {/* Observaciones */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Observaciones:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="observaciones"
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
            />
          </div>

          {/* Empresa (select) */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Empresa:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <select
              name="id_propietario"
              value={formData.id_propietario}
              onChange={handleEmpresaChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600"
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
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Nombre propietario:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="nombre_propietario"
              placeholder="Nombre propietario"
              value={formData.nombre_propietario}
              readOnly
              className="w-60 h-10 px-4 text-sm bg-gray-300 border border-gray-200 rounded text-gray-600 text-left cursor-not-allowed"
            />
          </div>

          {/* Teléfono propietario (autocompletado, readonly) */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Teléfono propietario:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="telefono_propietario"
              placeholder="Teléfono propietario"
              value={formData.telefono_propietario}
              readOnly
              className="w-60 h-10 px-4 text-sm bg-gray-300 border border-gray-200 rounded text-gray-600 text-left cursor-not-allowed"
            />
          </div>

          <br />
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

export default FormularioVehiculos;