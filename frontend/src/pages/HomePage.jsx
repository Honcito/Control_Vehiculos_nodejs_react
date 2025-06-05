import { useEffect, useState } from "react";
import api from "../lib/axios";
import { Home } from "lucide-react";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Cargando o no autenticado...</p>;

  return (
    <div className="text-center px-4 py-5">
      <br/>
      <br/>
      <h1 className="font-bold text-4xl text-green-400">
        Hola{" "}
        {user.username.charAt(0).toUpperCase() +
          user.username.toLowerCase().slice(1)}
      </h1>

      <br />
      <br />

      {user.role === "ROLE_ADMIN" ? (
        <div className="flex flex-col md:flex-row justify-center gap-10 mb-6">
          {/* Instrucciones para Usuarios */}
          <div className="w-full md:w-1/3">
            <div className="min-h-[450px] rounded-xl">
              <div className="rounded-t-xl px-4 py-3">
                <h4 className="text-3xl font-bold text-center">
                  Instrucciones para Usuarios
                </h4>
                <br />
              </div>
              <div className="p-4 text-xl">
                <ul className="list-inside space-y-2">
                  <li className="text-left">
                    <strong>Ingreso de Matrícula:</strong> Introduzca la
                    matrícula del vehículo. El nombre de la empresa se completa
                    automáticamente.
                  </li>
                  <li className="text-left">
                    <strong>Fecha/Hora de Salida:</strong> Clic en el campo para
                    rellenar con la fecha y hora actual.
                  </li>
                  <li className="text-left">
                    <strong>Guardar Datos:</strong> Clic en Guardar para
                    registrar la salida.
                  </li>
                  <li className="text-left">
                    <strong>Fecha/Hora de Entrada:</strong> Clic para registrar
                    el regreso del vehículo y actualizar datos.
                  </li>
                  <li className="text-left">
                    <strong>Observaciones:</strong> Agregue comentarios si lo
                    desea.
                  </li>
                  <li className="text-left">
                    <strong>Cerrar Sesión:</strong> Clic en Cerrar sesión al
                    finalizar su turno.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Instrucciones para Administradores */}
          <div className="w-full md:w-1/3">
            <div className="min-h-[450px] rounded-xl">
              <div className="rounded-t-xl px-4 py-3">
                <h4 className="text-3xl font-bold text-center">
                  Instrucciones para Administradores
                </h4>
                <br />
              </div>
              <div className="p-4 text-xl">
                <ul className="list-inside space-y-2">
                  <li className="text-left">
                    <strong>Acceso Completo:</strong> Acceso total al sistema.
                  </li>
                  <li className="text-left">
                    <strong>Consulta de Registros:</strong> Visualización de
                    entradas y salidas.
                  </li>
                  <li className="text-left">
                    <strong>Gestión de Usuarios:</strong> Añadir, editar o
                    eliminar usuarios.
                  </li>
                  <li className="text-left">
                    <strong>Generación de Reportes:</strong> Crear informes
                    detallados.
                  </li>
                  <li className="text-left">
                    <strong>Seguridad y Control:</strong> Configuración de roles
                    y permisos.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-10 mb-6">
          {/* Instrucciones para Usuarios */}
          <div className="w-full md:w-1/3">
            <div className="min-h-[450px] rounded-xl">
              <div className="rounded-t-xl px-4 py-3">
                <h4 className="text-3xl font-bold text-center">
                  Instrucciones para Usuarios
                </h4>
                <br />
              </div>
              <div className="p-4 text-xl">
                <ul className="list-inside space-y-2">
                  <li className="text-left">
                    <strong>Ingreso de Matrícula:</strong> Introduzca la
                    matrícula del vehículo. El nombre de la empresa se completa
                    automáticamente.
                  </li>
                  <li className="text-left">
                    <strong>Fecha/Hora de Salida:</strong> Clic en el campo para
                    rellenar con la fecha y hora actual.
                  </li>
                  <li className="text-left">
                    <strong>Guardar Datos:</strong> Clic en Guardar para
                    registrar la salida.
                  </li>
                  <li className="text-left">
                    <strong>Fecha/Hora de Entrada:</strong> Clic para registrar
                    el regreso del vehículo.
                  </li>
                  <li className="text-left">
                    <strong>Observaciones:</strong> Agregue comentarios si lo
                    desea.
                  </li>
                  <li className="text-left">
                    <strong>Cerrar Sesión:</strong> Clic en Cerrar sesión al
                    finalizar su turno.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
