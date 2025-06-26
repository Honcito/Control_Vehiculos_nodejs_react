import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
      fetch(`http://localhost:3000/api/propietarios/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar propietario");
          return res.json();
        })
        .then((data) => setFormData(data))
        .catch(() => toast.error("Error al cargar propietario"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:3000/api/propietarios/${id}`
      : "http://localhost:3000/api/propietarios";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        toast.success(id ? "Propietario actualizado" : "Propietario creado");
        navigate("/propietarios");
      })
      .catch((err) => {
        console.error("Error en el formulario:", err);
        toast.error(err.message);
      });
  };

  const handleDelete = () => {
    if (!id) return;

    const toastId = toast(
      (t) => (
        <div className="bg-gray-800 text-white p-4 rounded shadow space-y-4 max-w-xs">
          <p>¿Seguro que quieres eliminar este propietario?</p>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancelar
            </button>
            <button
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              onClick={() => {
                toast.loading("Eliminando...", { id: toastId });

                fetch(`http://localhost:3000/api/propietarios/${id}`, {
                  method: "DELETE",
                  credentials: "include",
                })
                  .then((res) => {
                    if (!res.ok) throw new Error("Error al eliminar");
                    toast.success("Propietario eliminado", { id: toastId });
                    navigate("/propietarios");
                  })
                  .catch((err) =>
                    toast.error(err.message || "Error al eliminar", { id: toastId })
                  );
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
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6">
      <section className="w-full max-w-sm min-h-[550px] bg-gray-900 rounded-lg shadow-xl p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {id ? "Editar Propietario" : "Nuevo Propietario"}
          </h2>
        </div>
        <br />
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Empresa */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">Empresa:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="empresa"
              placeholder="Empresa"
              value={formData.empresa}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
            />
          </div>

          {/* Nombre */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">Nombre:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
            />
          </div>

          {/* Nº plazas */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">Nº plazas:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="num_plazas"
              placeholder="Nº de plazas alquiladas"
              value={formData.num_plazas || ""}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required
            />
          </div>

          {/* Teléfono/s */}
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">Teléfono/s:</label>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono/s"
              value={formData.telefono}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button type="submit" className="btn-update">
              {id ? "Actualizar" : "Crear"}
            </button>

            {id && (
              <button
                type="button"
                className="btn-delete bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default FormularioPropietario;
