import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FormularioVehiculos = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay id, estamos editando
  const [formData, setFormData] = useState({
    matricula: "",
    num_aparcamiento: "",
    observaciones: "",
    propietario: "", // guardaremos id_propietario aquí
    nombre_propietario: "",
    telefono_propietario: "",
    empresa: "", // para mostrar nombre empresa en select
  });

  const [propietarios, setPropietarios] = useState([]); // para llenar el select

  // Cargar lista de propietarios para el select
  useEffect(() => {
    fetch("http://localhost:3000/api/propietarios", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar propietarios");
        return res.json();
      })
      .then(data => setPropietarios(data))
      .catch(err => console.error(err));
  }, []);

  // Si estamos editando, cargar datos del vehículo
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/vehiculos/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(res => {
          if (!res.ok) throw new Error("Error al cargar vehículo");
          return res.json();
        })
        .then(data => {
          // data debe incluir: matricula, num_aparcamiento, observaciones, propietario (id), y campos del propietario
          setFormData({
            matricula: data.matricula || "",
            num_aparcamiento: data.num_aparcamiento || "",
            observaciones: data.observaciones || "",
            propietario: data.propietario || "",
            nombre_propietario: data.nombre_propietario || "",
            telefono_propietario: data.telefono_propietario || "",
            empresa: data.empresa || "",
          });
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  // Cuando cambia el select de empresa (propietario), autocompletar teléfono y nombre
  const handleEmpresaChange = (e) => {
    const selectedId = e.target.value;
    const propietario = propietarios.find(p => p.id_propietario.toString() === selectedId);
    setFormData(prev => ({
      ...prev,
      propietario: selectedId,
      empresa: propietario ? propietario.empresa : "",
      nombre_propietario: propietario ? propietario.nombre : "",
      telefono_propietario: propietario ? propietario.telefono : "",
    }));
  };

  // Para inputs normales (matricula, num_aparcamiento, observaciones)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando datos:", formData);
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:3000/api/vehiculos/${id}`
      : "http://localhost:3000/api/vehiculos";
  
    const body = {
      matricula: formData.matricula,
      num_aparcamiento: formData.num_aparcamiento,
      observaciones: formData.observaciones,
      id_propietario: formData.propietario,
    };
  
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar vehículo");
        navigate("/vehiculos");
      })
      .catch(err => console.error("Error en el formulario:", err));
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
            <label className="w-60 text-xl">Matrícula:</label>
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
            <label className="w-60 text-xl">Número de aparcamiento:</label>
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
              min={1}
            />
          </div>

          {/* Observaciones */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">Observaciones:</label>
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
            <label className="w-60 text-xl">Empresa:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <select
              name="propietario"
              value={formData.propietario}
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
            <label className="w-60 text-xl">Nombre propietario:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="nombre_propietario"
              placeholder="Nombre propietario"
              value={formData.nombre_propietario}
              readOnly
              className="w-60 h-10 px-4 text-sm bg-gray-300 border border-gray-200 rounded text-gray-600 text-left"
            />
          </div>

          {/* Teléfono propietario (autocompletado, readonly) */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">Teléfono propietario:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="telefono_propietario"
              placeholder="Teléfono propietario"
              value={formData.telefono_propietario}
              readOnly
              className="w-60 h-10 px-4 text-sm bg-gray-300 border border-gray-200 rounded text-gray-600 text-left"
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
