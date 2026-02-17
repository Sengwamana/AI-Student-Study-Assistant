import { Outlet } from "react-router-dom";
import LandingNavbar from "../../components/landingNavbar/LandingNavbar";
import Footer from "../../components/footer/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <LandingNavbar />
      <div className="flex-1 flex flex-col">
          <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
