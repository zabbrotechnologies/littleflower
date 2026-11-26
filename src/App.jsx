import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustHighlights from './components/TrustHighlights';
import About from './components/About';
import LearningPhilosophy from './components/LearningPhilosophy';
import Programs from './components/Programs';
import WhyChooseUs from './components/WhyChooseUs';
import Achievements from './components/Achievements';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import AdmissionCTA from './components/AdmissionCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const handleOpenAdminLogin = () => {
    if (adminUser) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setIsAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    setAdminUser(null);
    setIsAdminDashboardOpen(false);
  };

  return (
    <div className="min-h-screen text-[#252525] selection:bg-[#DCEBDD] selection:text-[#24543D] font-body relative overflow-x-hidden antialiased">
      <Navbar onAdminClick={handleOpenAdminLogin} />
      <main>
        <Hero onAdminClick={handleOpenAdminLogin} />
        <TrustHighlights />
        <About />
        <LearningPhilosophy />
        <Programs />
        <WhyChooseUs />
        <Achievements />
        <Gallery />
        <Testimonials />
        <AdmissionCTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onClose={() => setIsAdminDashboardOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
