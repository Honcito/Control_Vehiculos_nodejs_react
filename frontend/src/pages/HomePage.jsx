import { useEffect, useState } from "react";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const matriculasEjemplo = [
    "7533 MBB",
    "3230 CPJ",
    "5114 KWK",
    "3820 DHM",
    "8969 LMF",
    "8559 BH",
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-4 py-8 md:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Saludo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-500 tracking-tight">
            Hola {user ? user.nombre : "Hong"}
          </h1>
          <p className="text-base-content/70 text-lg">
            Bienvenido al sistema de gestión y control de acceso de vehículos.
          </p>
        </div>

        {/* Guía Práctica de Control de Vehículos */}
        <div className="bg-base-200 border border-base-300 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-base-300 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-base-content">
              Guía Práctica del Control de Vehículos
            </h2>
            <div className="bg-base-300 px-4 py-2 rounded-lg text-xs md:text-sm font-mono text-base-content/80">
              <span className="font-semibold text-emerald-500">Credenciales Demo:</span> usuario: <span className="font-bold">USUARIO</span> | pass: <span className="font-bold">USUARIO</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Paso 1 */}
            <div className="bg-base-100 p-5 rounded-xl border border-base-300 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold text-sm rounded-md">
                  1. Matrícula y Datos
                </span>
                <p className="text-sm text-base-content/80 leading-relaxed">
                  Escribe 3 letras o números para autocompletar la empresa y plaza asignada.
                </p>
              </div>

              {/* Matrículas sin bordes gruesos y en formato badge visual limpio */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-base-content/60 mb-2">
                  Ejemplos de prueba:
                </p>
                <div className="flex flex-wrap gap-2">
                  {matriculasEjemplo.map((mat) => (
                    <span
                      key={mat}
                      className="bg-base-200 text-base-content px-2.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wide shadow-xs"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-base-100 p-5 rounded-xl border border-base-300 space-y-2 shadow-sm">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold text-sm rounded-md">
                2. Marcar Horarios
              </span>
              <p className="text-sm text-base-content/80 leading-relaxed">
                Haz clic sobre el campo de Fecha Salida o Fecha Entrada para registrar instantáneamente la hora exacta del sistema.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-base-100 p-5 rounded-xl border border-base-300 space-y-2 shadow-sm">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold text-sm rounded-md">
                3. Comentarios y Guardar
              </span>
              <p className="text-sm text-base-content/80 leading-relaxed">
                Agrega notas opcionales en el área de Observaciones y haz clic en el botón verde <strong className="text-emerald-500">Guardar</strong> para registrar el movimiento.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="bg-base-100 p-5 rounded-xl border border-base-300 space-y-2 shadow-sm">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold text-sm rounded-md">
                4. Actualizar o Borrar
              </span>
              <p className="text-sm text-base-content/80 leading-relaxed">
                Usa el botón azul <strong className="text-blue-500">Actualizar</strong> tras registrar la fecha de regreso, o el botón rojo <strong className="text-red-500">Borrar</strong> para eliminar la fila.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Instrucciones en 2 Columnas Desahogadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Instrucciones Usuarios */}
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-xl font-bold text-emerald-500 border-b border-base-300 pb-3">
              Instrucciones para Usuarios
            </h3>
            <ul className="space-y-3 text-sm text-base-content/90 leading-relaxed">
              <li>
                <strong className="text-base-content">Ingreso de Matrícula:</strong> Introduzca la matrícula del vehículo. El nombre de la empresa se completa automáticamente.
              </li>
              <li>
                <strong className="text-base-content">Fecha/Hora de Salida:</strong> Haz clic en el campo para rellenar con la fecha y hora actual.
              </li>
              <li>
                <strong className="text-base-content">Guardar Datos:</strong> Haz clic en Guardar para registrar la salida.
              </li>
              <li>
                <strong className="text-base-content">Fecha/Hora de Entrada:</strong> Haz clic para registrar el regreso del vehículo y actualizar los datos.
              </li>
              <li>
                <strong className="text-base-content">Observaciones:</strong> Agregue comentarios opcionales si lo requiere.
              </li>
              <li>
                <strong className="text-base-content">Cerrar Sesión:</strong> Haz clic en Cerrar sesión al finalizar su turno.
              </li>
            </ul>
          </div>

          {/* Instrucciones Administradores */}
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-xl font-bold text-amber-500 border-b border-base-300 pb-3">
              Instrucciones para Administradores
            </h3>
            <ul className="space-y-3 text-sm text-base-content/90 leading-relaxed">
              <li>
                <strong className="text-base-content">Acceso Completo:</strong> Control y gestión total sobre todos los módulos del sistema.
              </li>
              <li>
                <strong className="text-base-content">Consulta de Registros:</strong> Visualización general e historial de todas las entradas y salidas.
              </li>
              <li>
                <strong className="text-base-content">Gestión de Usuarios:</strong> Crear, modificar roles, actualizar o eliminar datos de usuarios.
              </li>
              <li>
                <strong className="text-base-content">Generación de Reportes:</strong> Crear y exportar informes de actividad detallados.
              </li>
              <li>
                <strong className="text-base-content">Seguridad y Control:</strong> Configuración global de parámetros, permisos y seguridad.
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HomePage;