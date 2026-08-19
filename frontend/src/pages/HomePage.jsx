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
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
        <p className="text-xl font-semibold animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
        <p className="text-xl font-semibold text-error">No autenticado</p>
      </div>
    );
  }

  const isAdmin = user.role === "ROLE_ADMIN";

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 py-10 flex flex-col items-center">
      {/* Saludo con nombre formateado */}
      <h1 className="font-bold text-4xl text-primary my-6 text-center">
        Hola{" "}
        {user.username.charAt(0).toUpperCase() +
          user.username.slice(1).toLowerCase()}
      </h1>

      {/* Card Guía Práctica de Uso / Demostración */}
      <div className="w-full max-w-5xl bg-base-200 rounded-xl shadow-xl p-6 border border-base-300 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-base-300 pb-4 mb-4 gap-2">
          <h2 className="text-2xl font-bold text-secondary">
            Guía Práctica del Control de Vehículos
          </h2>
          <div className="bg-base-300 px-3 py-1 rounded text-xs text-base-content/70">
            <strong>Credenciales Demo:</strong> usuario: <code className="text-primary font-mono">usuario</code> | pass: <code className="text-primary font-mono">usuario</code>
          </div>
        </div>

        <p className="text-sm text-base-content/80 mb-4">
          A continuación se detalla el flujo completo de trabajo utilizando la tabla interactiva de control:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-base-100 p-4 rounded-lg border border-base-300">
            <span className="font-bold text-primary block mb-1">1. Matrícula y Datos</span>
            <p className="text-xs text-base-content/70 mb-2">
              Escribe 3 letras o números para autocompletar la empresa y plaza asignada.
            </p>
            <div className="bg-base-200 p-2 rounded text-xs font-mono">
              <span className="text-base-content/50 block">Ejemplos de prueba:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="badge badge-sm badge-outline">7533 MBB</span>
                <span className="badge badge-sm badge-outline">3230 CPJ</span>
                <span className="badge badge-sm badge-outline">5114 KWK</span>
                <span className="badge badge-sm badge-outline">3820 DHM</span>
                <span className="badge badge-sm badge-outline">8969 LMF</span>
                <span className="badge badge-sm badge-outline">8559 BH</span>
              </div>
            </div>
          </div>

          <div className="bg-base-100 p-4 rounded-lg border border-base-300">
            <span className="font-bold text-primary block mb-1">2. Marcar Horarios</span>
            <p className="text-xs text-base-content/70">
              Haz <strong>clic sobre el campo</strong> de <span className="underline">Fecha Salida</span> o <span className="underline">Fecha Entrada</span> para registrar instantáneamente la hora exacta del sistema.
            </p>
          </div>

          <div className="bg-base-100 p-4 rounded-lg border border-base-300">
            <span className="font-bold text-primary block mb-1">3. Comentarios y Guardar</span>
            <p className="text-xs text-base-content/70">
              Agrega notas opcionales en el área de <em>Observaciones</em> y haz clic en el botón verde <strong className="text-success">Guardar</strong> para registrar el movimiento en el historial.
            </p>
          </div>

          <div className="bg-base-100 p-4 rounded-lg border border-base-300">
            <span className="font-bold text-primary block mb-1">4. Actualizar o Borrar</span>
            <p className="text-xs text-base-content/70">
              Usa el botón azul <strong className="text-info">Actualizar</strong> tras registrar la fecha de regreso, o el botón rojo <strong className="text-error">Borrar</strong> para eliminar la fila tras confirmar.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center items-stretch gap-8">
        {/* Instrucciones para Usuarios */}
        <div className="w-full md:w-1/2 bg-base-200 rounded-xl shadow-xl p-6 border border-base-300 flex flex-col">
          <h2 className="text-2xl font-bold text-center text-info mb-6 pb-2 border-b border-base-300">
            Instrucciones para Usuarios
          </h2>
          <ul className="space-y-4 text-base-content/80 text-base leading-relaxed flex-grow">
            <li className="text-left">
              <strong className="text-base-content">Ingreso de Matrícula:</strong>{" "}
              Introduzca la matrícula del vehículo. El nombre de la empresa se
              completa automáticamente.
            </li>
            <li className="text-left">
              <strong className="text-base-content">Fecha/Hora de Salida:</strong> Haz
              clic en el campo para rellenar con la fecha y hora actual.
            </li>
            <li className="text-left">
              <strong className="text-base-content">Guardar Datos:</strong> Haz clic en
              Guardar para registrar la salida.
            </li>
            <li className="text-left">
              <strong className="text-base-content">Fecha/Hora de Entrada:</strong> Haz
              clic para registrar el regreso del vehículo y actualizar los datos.
            </li>
            <li className="text-left">
              <strong className="text-base-content">Observaciones:</strong> Agregue
              comentarios opcionales si lo requiere.
            </li>
            <li className="text-left">
              <strong className="text-base-content">Cerrar Sesión:</strong> Haz clic en
              Cerrar sesión al finalizar su turno.
            </li>
          </ul>
        </div>

        {/* Instrucciones para Administradores (Sólo visible para ROLE_ADMIN) */}
        {isAdmin && (
          <div className="w-full md:w-1/2 bg-base-200 rounded-xl shadow-xl p-6 border border-base-300 flex flex-col">
            <h2 className="text-2xl font-bold text-center text-warning mb-6 pb-2 border-b border-base-300">
              Instrucciones para Administradores
            </h2>
            <ul className="space-y-4 text-base-content/80 text-base leading-relaxed flex-grow">
              <li className="text-left">
                <strong className="text-base-content">Acceso Completo:</strong>{" "}
                Control y gestión total sobre todos los módulos del sistema.
              </li>
              <li className="text-left">
                <strong className="text-base-content">Consulta de Registros:</strong>{" "}
                Visualización general e historial de todas las entradas y
                salidas.
              </li>
              <li className="text-left">
                <strong className="text-base-content">Gestión de Usuarios:</strong>{" "}
                Crear, modificar roles, actualizar o eliminar datos de usuarios.
              </li>
              <li className="text-left">
                <strong className="text-base-content">Generación de Reportes:</strong>{" "}
                Crear y exportar informes de actividad detallados.
              </li>
              <li className="text-left">
                <strong className="text-base-content">Seguridad y Control:</strong>{" "}
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