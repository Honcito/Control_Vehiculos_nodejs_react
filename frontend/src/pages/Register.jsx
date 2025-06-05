import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../btn.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nombre || !password) {
      setError("Los campos nombre y contraseña son obligatorios");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, password, telefono }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      setSuccess("Registro exitoso. Redirigiendo a inicio de sesión...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6">
      <section className="w-full max-w-sm min-h-[550px] bg-gray-900 rounded-lg shadow-xl p-10 space-y-8">
        <br />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Registro de Empleados</h2>
        </div>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">
              Nombre:<span className="text-red-500">*</span>
            </label>
          </div>
          <br />
          <div className="mb-8 flex items-center justify-center">
            <input
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Nombre de usuario"
            />
          </div>
          <br />
          <div className="mb-8 flex items-center justify-center">
            <label className="w-60 text-xl">
              Contraseña:<span className="text-red-500">*</span>
            </label>
          </div>
          <br />
          <div className="mb-6 flex items-center justify-center">
            <input
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
            />
          </div>
          <br />
          <div className="mb-6 flex items-center justify-center">
            <label className="w-60 text-xl text-white">Teléfono (opcional)</label>
          </div>
          <br/>
          <div className="mb-6 flex items-center justify-center">
            <input
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 600123456"
            />
          </div>
          <br/>
          {error && (
            <p className="text-sm text-red-500 text-center font-semibold mb-4">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-400 text-center font-semibold mb-4">
              {success}
            </p>
          )}

          <br />
          <div className="mb-6 flex items-center justify-center">
            <button type="submit" className="btn-login">
              Registrarse
            </button>
          </div>
          <br />
          
        </form>
      </section>
    </div>
  );
};

export default Register;
