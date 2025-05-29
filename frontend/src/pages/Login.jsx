import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../btn.css'

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ nombre, password });

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6">
      <section className="w-full max-w-sm min-h-[550px] bg-gray-900 rounded-lg shadow-xl p-10 space-y-8">
        <br/>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Control de Vehículos
          </h2>
        </div>
        <br/>
        <form onSubmit={handleSubmit}>
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl"> Nombre:</label>
          </div>
          <br/>
          <div className="mb-8 flex items-center justify-center">
            <input
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <br/>
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl"> Contraseña:</label>
          </div>
          <br/>
          <div className="mb-6 flex items-center justify-center">
            <input
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center font-semibold mb-4">
              {error}
            </p>
          )}
          <br/>
          <br/>
          <div className="mb-6 flex items-center justify-center">
            <button
              type="submit"
              className="btn-login"
              // w-60 h-14 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-white transition duration-200
            >
              Iniciar sesión
            </button>
          </div>
          <br/>
          <br/>
          <div className="flex items-center justify-center text-gray-300">
            
            <a className="text-sm text-blue-500 hover:underline" href="/register">
              ¿No tienes cuenta? Regístrate aquí
            </a>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
