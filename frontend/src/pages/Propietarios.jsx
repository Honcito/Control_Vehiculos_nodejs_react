import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../btn.css';

const Propietarios = () => {
  const [propietarios, setPropietarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/propietarios", {
      method: "GET",
      credentials: "include",  // para enviar cookies de sesión
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        //console.log("Respuesta del backend:", data);
        setPropietarios(data);
      })
      .catch((error) => console.error("Error cargando propietarios:", error));
  }, []);

  const handleEditar = (id) => {
    navigate(`/propietarios/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este propietario?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3000/api/propietarios/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      setPropietarios(propietarios.filter(p => p.id_propietario !== id));
    } catch (error) {
      console.error("Error eliminando propietario:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-8 py-6">
  <div className="bg-base-200 rounded-lg shadow-sm p-4">
    <div className="bg-base-500 rounded flex place-items-center justify-between px-8 py-3">
      <h2 className="text-3xl font-bold">Lista de Propietarios</h2>
      <button
        className="btn-add"
        onClick={() => navigate("/propietarios/nuevo")}
      >
        Añadir Propietario
      </button>
    </div>

  
        <div className="overflow-x-auto bg-base-100">
          <table className="w-full text-lg text-center table table-zebra">
            <thead className="bg-white text-black capitalize sticky top-0 z-10">
              <tr className="h-12 text-lg">
                <th className="px-4 py-2 min-w-[80px] text-center">ID</th>
                <th className="px-4 py-2 min-w-[80px] text-center">Empresa</th>
                <th className="px-4 py-2 min-w-[80px] text-center">Nombre</th>
                <th className="px-4 py-2 min-w-[80px] text-center">Nº Plazas</th>
                <th className="px-4 py-2 min-w-[80px] text-center">Teléfono</th>
                <th className="px-4 py-2 min-w-[80px] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-700 text-base font-semibold">
              {propietarios.map((prop) => (
                <tr key={prop.id_propietario} className="hover:bg-base-300">
                  <td className="px-4 py-2">{prop.id_propietario}</td>
                  <td className="px-4 py-2">{prop.empresa}</td>
                  <td className="px-4 py-2">{prop.nombre}</td>
                  <td className="px-4 py-2">{prop.num_aparcamiento}</td>
                  <td className="px-4 py-2">{prop.telefono}</td>
                  <td className="px-4 py-2 text-center flex justify-center space-x-2">
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
                  </td>
                </tr>
              ))}
              {propietarios.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-base-content opacity-50">
                    No hay propietarios registrados.
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

export default Propietarios;
