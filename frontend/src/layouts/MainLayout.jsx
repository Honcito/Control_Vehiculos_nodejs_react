import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-dvh w-full bg-base-100 text-base-content">
      <Navbar />
      {/* Eliminamos 'max-w-7xl' y 'mx-auto' para dar paso al ancho completo */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;