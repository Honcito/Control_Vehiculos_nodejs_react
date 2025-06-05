import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


const MainLayout = ({ children }) => {
  return (
    <>
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
        <Navbar />
        <main className="flex-grow overflow-auto">{children}</main>
        <Footer />
    </div>
    </>

  )
}

export default MainLayout