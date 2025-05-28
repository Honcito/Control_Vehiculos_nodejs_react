import { Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import Propietarios from "./pages/Propietarios";
import Vehiculos from "./pages/Vehiculos";
import ControlVehiculos from "./pages/ControlVehiculos";
import Logout from "./pages/Logout";
import Usuarios from "./pages/Usuarios";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      <div >
        {/* <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div> */}
        
          <Routes>
            <Route path="/" element={
              <MainLayout>
              <HomePage />
              </MainLayout>
              } />
            <Route path="/usuarios" element={
              <MainLayout>
              <Usuarios />
              </MainLayout>} />
            <Route path="/propietarios" element={
              <MainLayout>
              <Propietarios />
              </MainLayout>} />
            <Route path="/vehiculos" element={
              <MainLayout>
              <Vehiculos />
              </MainLayout>} />
            <Route path="/control_vehiculos" element={
              <MainLayout>
              <ControlVehiculos />
              </MainLayout>} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        
      </div>
    </>
  );
}

export default App;
