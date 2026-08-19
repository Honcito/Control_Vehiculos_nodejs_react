import { useEffect, useState } from "react";
import api from "../lib/axios";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p className="text-xl font-semibold animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p className="text-xl font-semibold text-red-400">No autenticado</p>
      </div>
    );
  }

  const isAdmin = user.role === "ROLE_ADMIN";

  return (
    <div className="min-h-screen bg-gray-800 text-white px-6 py-10 flex flex-col items-center">
      {/* Saludo con nombre formateado */}
      <h1 className="font-bold text-4xl text-green-400 my-8 text-center">
        Hola{" "}
        {user.username.charAt(0).toUpperCase() +
          user.username.slice(1).toLowerCase()}
      </h1>

      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center items-stretch gap-8 my-6">
        {/* Instrucciones para Usuarios */}
        <div className="w-full md:w-1/2 bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-700 flex flex-col">
          <h2 className="text-2xl font-bold text-center text-blue-400 mb-6 pb-2 border-b border-gray-700">
            Instrucciones para Usuarios
          </h2>
          <ul className="space-y-4 text-gray-300 text-base leading-relaxed flex-grow">
            <li className="text-left">
              <strong className="text-white">Ingreso de Matrícula:</strong>{" "}
              Introduzca la matrícula del vehículo. El nombre de la empresa se
              completa automáticamente.
            </li>
            <li className="text-left">
              <strong className="text-white">Fecha/Hora de Salida:</strong> Haz
              clic en el campo para rellenar con la fecha y hora actual.
            </li>
            <li className="text-left">
              <strong className="text-white">Guardar Datos:</strong> Haz clic en
              Guardar para registrar la salida.
            </li>
            <li className="text-left">
              <strong className="text-white">Fecha/Hora de Entrada:</strong> Haz
              clic para registrar el regreso del vehículo y actualizar los datos.
            </li>
            <li className="text-left">
              <strong className="text-white">Observaciones:</strong> Agregue
              comentarios opcionales si lo requiere.
            </li>
            <li className="text-left">
              <strong className="text-white">Cerrar Sesión:</strong> Haz clic en
              Cerrar sesión al finalizar su turno.
            </li>
          </ul>
        </div>

        {/* Instrucciones para Administradores (Sólo visible para ROLE_ADMIN) */}
        {isAdmin && (
          <div className="w-full md:w-1/2 bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-700 flex flex-col">
            <h2 className="text-2xl font-bold text-center text-amber-400 mb-6 pb-2 border-b border-gray-700">
              Instrucciones para Administradores
            </h2>
            <ul className="space-y-4 text-gray-300 text-base leading-relaxed flex-grow">
              <li className="text-left">
                <strong className="text-white">Acceso Completo:</strong>{" "}
                Control y gestión total sobre todos los módulos del sistema.
              </li>
              <li className="text-left">
                <strong className="text-white">Consulta de Registros:</strong>{" "}
                Visualización general e historial de todas las entradas y
                salidas.
              </li>
              <li className="text-left">
                <strong className="text-white">Gestión de Usuarios:</strong>{" "}
                Crear, modificar roles, actualizar o eliminar datos de usuarios.
              </li>
              <li className="text-left">
                <strong className="text-white">Generación de Reportes:</strong>{" "}
                Crear y exportar informes de actividad detallados.
              </li>
              <li className="text-left">
                <strong className="text-white">Seguridad y Control:</strong>{" "}
                Configuración global de parámetros, permisos y seguridad.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;