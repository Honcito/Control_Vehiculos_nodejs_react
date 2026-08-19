import axios from 'axios';

// Si existe VITE_API_URL en el .env la usa; si no, recurre al fallback local o relativo
const BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === "development" 
    ? "http://localhost:3001/api-vehiculos" 
    : "/api-vehiculos"
);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true // Necesario para el envio/recepcion de cookies de sesion
});

export default api;