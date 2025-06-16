import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import Propietarios from "./pages/Propietarios";
import Vehiculos from "./pages/Vehiculos";
import ControlVehiculos from "./pages/ControlVehiculos";
import Logout from "./pages/Logout";
import Usuarios from "./pages/Usuarios";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FormularioPropietario from "./pages/FormularioPropietario";
import FormularioVehiculos from './pages/FormularioVehiculos';

function App() {
  return (
    <>
      <div>

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/usuarios"
            element={
              <MainLayout>
                <Usuarios />
              </MainLayout>
            }
          />
          <Route
            path="/propietarios"
            element={
              <MainLayout>
                <Propietarios />
              </MainLayout>
            }
          />
          <Route
            path="/propietarios/nuevo"
            element={
              <MainLayout>
                <FormularioPropietario />
              </MainLayout>
            }
          />
          <Route
            path="/propietarios/editar/:id"
            element={
              <MainLayout>
                <FormularioPropietario />
              </MainLayout>
            }
          />
          <Route
            path="/vehiculos"
            element={
              <MainLayout>
                <Vehiculos />
              </MainLayout>
            }
          />
          <Route
            path="/vehiculos/nuevo"
            element={
              <MainLayout>
                <FormularioVehiculos />
              </MainLayout>
            }
          />
          <Route
            path="/vehiculos/editar/:id"
            element={
              <MainLayout>
                <FormularioVehiculos />
              </MainLayout>
            }
          />
          <Route
            path="/control_vehiculos"
            element={
              <MainLayout>
                <ControlVehiculos />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout>
                <Register />
              </MainLayout>
            }
          />
          <Route path="/logout" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
