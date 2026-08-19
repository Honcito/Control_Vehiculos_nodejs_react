import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios"; // Instancia centralizada de Axios
import "../btn.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/usuarios")
      .then((res) => {
        setUsuarios(res.data);
      })
      .catch((error) => {
        console.error("Error cargando usuarios:", error);
        toast.error("Error al obtener la lista de usuarios");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este usuario?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      toast.error(
        error.response?.data?.message || "Error al eliminar el usuario"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white px-8 py-6">
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700 space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-white">Lista de Usuarios</h2>
          <button
            className="btn-add"
            onClick={() => navigate("/usuarios/nuevo")}
          >
            Añadir Usuario
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-center divide-y divide-gray-700">
            <thead className="bg-gray-800 text-gray-200 capitalize sticky top-0 z-10">
              <tr className="h-12 text-sm md:text-base font-semibold">
                <th className="px-4 py-3 min-w-[80px]">ID</th>
                <th className="px-4 py-3 min-w-[120px]">Nombre</th>
                <th className="px-4 py-3 min-w-[120px]">Teléfono</th>
                <th className="px-4 py-3 min-w-[100px]">Rol</th>
                <th className="px-4 py-3 min-w-[150px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800 text-sm md:text-base font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usr) => (
                  <tr
                    key={usr.id_usuario}
                    className="hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="px-4 py-3">{usr.id_usuario}</td>
                    <td className="px-4 py-3">{usr.nombre}</td>
                    <td className="px-4 py-3">{usr.telefono || "—"}</td>
                    <td className="px-4 py-3">{usr.rol || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditar(usr.id_usuario)}
                          className="btn-update"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(usr.id_usuario)}
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

export default Usuarios;