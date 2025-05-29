import { useEffect, useState } from "react";
import api from "../lib/axios"; // tu archivo con axios configurado
import { Home } from "lucide-react";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/api/auth/me")
      .then(res => {
        //console.log("Usuario desde backend:", res.data); // 👈
        setUser(res.data);
      })
      .catch(() => setUser(null));
  }, []);
  

  if (!user) return <p>Cargando o no autenticado...</p>;

  return (
    <div>
      <h1>Bienvenido/a, {user.username.charAt(0).toUpperCase() + user.username.toLowerCase().slice(1)}</h1>
      {user.role === "ROLE_ADMIN" ? (
        <p>Eres administrador/a, puedes gestionar todo.</p>
      ) : (
        <p>Eres usuario/a normal, solo puedes registrar vehículos.</p>
      )}
    </div>
  );
};

export default HomePage;