import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/api" //producción;


const api = axios.create({
    //baseURL: "http://localhost:3000/api"
    baseURL: BASE_URL,
    withCredentials: true // para el uso de cookies
});

export default api;