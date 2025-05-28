import { useEffect, useState } from "react";
import api from "../lib/axios"; // tu archivo con axios configurado
import { Home } from "lucide-react";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Cargando o no autenticado...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.username}</h1>
      {user.role === "ROLE_ADMIN" ? (
        <p>Eres administrador, puedes gestionar todo.</p>
      ) : (
        <p>Eres usuario normal, solo puedes registrar vehículos.</p>
      )}
    </div>
  );
};

export default HomePage;