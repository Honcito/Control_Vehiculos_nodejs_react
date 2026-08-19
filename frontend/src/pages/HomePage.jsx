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
    <div className="min-h-screen bg-base-100 text-base-content px-4 py-12 md:px-12 flex justify-center">
      <div className="w-full max-w-5xl space-y-10">

        {/* Header con saludo centrado */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight">
            Hola {user ? user.nombre : "USUARIO"}
          </h1>
          <p className="text-base md:text-lg text-base-content/70 max-w-2xl mx-auto">
            Bienvenido al sistema de gestión y control de acceso de vehículos.
          </p>
        </div>

        {/* Guía Práctica de Ancho Completo y Centrada */}
        <section className="bg-base-200/50 border border-base-300 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content text-center border-b border-base-300 pb-4">
            Guía Práctica del Control de Vehículos
          </h2>

          <div className="w-full bg-base-200 p-6 rounded-xl border border-base-300/80 shadow-md text-center space-y-4">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 font-bold text-base rounded-lg">
              1. Matrícula y Datos
            </span>
            
            <p className="text-sm md:text-base text-base-content/80 leading-relaxed max-w-2xl mx-auto">
              Escribe 3 letras o números para autocompletar la empresa y plaza asignada.
            </p>

            {/* Chips de Matrículas Planos */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-base-content/60 mb-3">
                Ejemplos de prueba:
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {matriculasEjemplo.map((mat) => (
                  <span
                    key={mat}
                    className="bg-base-300 text-base-content px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider shadow-xs"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bloques de Instrucciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Instrucciones Usuarios */}
          <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold text-emerald-400 border-b border-base-300 pb-3 text-center md:text-left">
              Instrucciones para Usuarios
            </h3>
            <ul className="space-y-4 text-sm md:text-base text-base-content/90 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-base-content">Ingreso de Matrícula:</strong> Introduzca la matrícula del vehículo. El nombre de la empresa se completa automáticamente.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-base-content">Fecha/Hora de Salida:</strong> Haz clic en el campo para rellenar con la fecha y hora actual.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-base-content">Guardar Datos:</strong> Haz clic en Guardar para registrar la salida.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-base-content">Fecha/Hora de Entrada:</strong> Haz clic para registrar el regreso del vehículo y actualizar los datos.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-base-content">Observaciones:</strong> Agregue comentarios opcionales si lo requiere.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-base-content">Cerrar Sesión:</strong> Haz clic en Cerrar sesión al finalizar su turno.</span>
              </li>
            </ul>
          </div>

          {/* Instrucciones Administradores */}
          <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold text-amber-400 border-b border-base-300 pb-3 text-center md:text-left">
              Instrucciones para Administradores
            </h3>
            <ul className="space-y-4 text-sm md:text-base text-base-content/90 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-base-content">Acceso Completo:</strong> Control y gestión total sobre todos los módulos del sistema.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-base-content">Consulta de Registros:</strong> Visualización general e historial de todas las entradas y salidas.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-base-content">Gestión de Usuarios:</strong> Crear, modificar roles, actualizar o eliminar datos de usuarios.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-base-content">Generación de Reportes:</strong> Crear y exportar informes de actividad detallados.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-base-content">Seguridad y Control:</strong> Configuración global de parámetros, permisos y seguridad.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HomePage;