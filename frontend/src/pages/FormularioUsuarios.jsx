import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FormularioUsuarios = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        nombre: "",
        password: "",
        rol: "",
        telefono: "",
    });

    useEffect(() =>{
        if (id) {
            fetch(`http://localhost:3000/api/usuarios/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar usuario");
                return res.json();
            })
            .then(data => {
                //console.log("Datos recibidos:", data);

                setFormData(data);
            })
            .catch(err => console.error(err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const method = id ? "PUT" : "POST";
        const url = id
          ? `http://localhost:3000/api/usuarios/${id}`
          : "http://localhost:3000/api/usuarios";
    
        fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
          
        })
          .then(res => {
            if (!res.ok) throw new Error("Error al guardar");
            
          })

          .then(() => {
            navigate("/usuarios");
          })
          .catch(err => console.error("Error en el formulario:", err));
      };
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6">
            <section className="w-full max-w-sm min-h-[550px] bg-gray-900 rounded-lg shadow-xl p-10 space-y-8">
          <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {id ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          </div>
          <br/>
          <form onSubmit={handleSubmit} className="space-y-4">
            <br/>
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
            <br/>
            <div className="mb-8 flex items-center justify-center">
                <label className="w-60 text-xl">Contraseña:</label>
              </div>
            <div className="mb-8 flex items-center justify-center">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
              required={!id}
            />
            </div>
           <br/>
           <div className="mb-8 flex items-center justify-center">
                <label className="w-60 text-xl">Teléfono:</label>
              </div>
            <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
            />
            </div>
            <br/>
            <div className="mb-8 flex items-center justify-center">
  <label className="w-60 text-xl">Rol:</label>
</div>
<div className="mb-8 flex items-center justify-center">
  <select
    name="rol"
    value={formData.rol}
    onChange={handleChange}
    className="w-60 h-10 px-4 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 rounded text-gray-600 text-left"
    required
  >
    <option value="">Selecciona un rol</option>
    <option value="ROLE_ADMIN">Administrador</option>
    <option value="ROLE_USER">Usuario</option>
  </select>
</div>

            <div className="flex justify-center">
            <button type="submit" className="btn-update">
              {id ? "Actualizar" : "Crear"}
            </button>
            </div>
          </form>
          </section>
        </div>
      );
    };

export default FormularioUsuarios