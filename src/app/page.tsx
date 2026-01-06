'use client';

import React, { useState } from 'react';
import { Search, ArrowLeft, MapPin, Calendar, CheckCircle, Star, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

import Navbar from '../components/navbar';
import Home from './User/Home/Home';
import Footer from '../components/footer';

import Login from './auth/Login/Login';
import Register from './auth/Register/Register';
import AdminDashboard from '../components/Admin/dashboard';
import MandorDashboard from '../components/Mandor/MandorDashboard';
// ServicePage removed
import AboutUsPage from './User/AboutUs/aboutUs';
import ChatBot from '../components/ChatBot';

// Service Page Components
// import ServiceHero from '../components/KategoriLayanan/ServiceHero'; // Relocated to KategoriLayanan
// import ServiceCategories from '../components/KategoriLayanan/ServiceCategories'; // Relocated
// import ServicePromo from '../components/KategoriLayanan/ServicePromo'; // Relocated
// import ServiceHighlights from '../components/KategoriLayanan/ServiceHighlights'; // Relocated
import KategoriLayanan from './User/KategoriLayanan/KategoriLayanan';
import BookingForm from './User/Form/FormRumah/FormRumah';
import BookingFormBusiness from '../components/FormBusiness/BookingFormBusiness';
import Layanan from './User/Home/Layanan/Layanan';
import BookingFormHandyman from './User/Form/FormTukang/FormTukang';
import ServiceRepairBooking from './User/Form/FormLayanan/FormLayanan';
import RepairServiceSelection from '../components/Layanan/RepairServiceSelection/RepairServiceSelection';
import MaterialSelection from '../components/Daftar-Layanan/MaterialSelection';

// Portfolio Page Components
// import PortfolioHero from '../components/Portfolio/PortfolioHero'; // Moved to separate component
import { Project } from '../components/Portfolio/PortfolioGrid';
// import PortfolioTestimonials from '../components/Portfolio/PortfolioTestimonials'; // Moved
import PortofolioDetails from '../components/Portfolio/PortofolioDetails';
import Portofolio from './User/Portofolio/Portofolio';

import HistoryPage from '../components/History/HistoryPage';

// --- Interfaces ---
interface SearchResultItem {
  id: number;
  title: string;
  provider: string;
  rating: number;
  price: string;
  unit: string;
  desc: string;
  image: string;
  isVerified: boolean;
  isPromo?: boolean;
}

// --- Data Constants ---
const SEARCH_RESULTS: SearchResultItem[] = [
  { id: 1, title: 'Paket Cuci AC Premium', provider: 'Cool Breeze Teknik', rating: 4.8, price: 'Rp 75.000', unit: 'unit', desc: 'Meliputi pencucian filter, pembersihan evaporator, pengecekan tekanan freon, dan pembersihan unit outdoor. Garansi dingin 30 hari.', image: 'https://images.unsplash.com/photo-1621905252507-b35a830ce50e?auto=format&fit=crop&q=80&w=300', isVerified: true, isPromo: true },
  { id: 2, title: 'Deteksi Kebocoran Pipa', provider: 'Master Pipa Jaya', rating: 4.9, price: 'Rp 150.000', unit: '', desc: 'Pengecekan dan perbaikan kebocoran pipa air bersih maupun kotor menggunakan alat deteksi modern.', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=300', isVerified: true, isPromo: false }
];

// --- Components ---

export default function BizzaPropertyApp() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'login' | 'register' | 'admin' | 'mandor' | 'layanan' | 'portfolio' | 'portfolio-details' | 'about' | 'booking-form' | 'booking-form-business' | 'handyman-selection' | 'booking-form-handyman' | 'history' | 'service-repair-booking' | 'repair-service-selection' | 'material-selection'>('home');
  const [selectedPortfolioProject, setSelectedPortfolioProject] = useState<Project | undefined>(undefined);
  const [selectedHandymanType, setSelectedHandymanType] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);

  const switchView = (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'mandor' | 'layanan' | 'portfolio' | 'portfolio-details' | 'about' | 'booking-form' | 'booking-form-business' | 'handyman-selection' | 'booking-form-handyman' | 'history' | 'service-repair-booking' | 'repair-service-selection' | 'material-selection') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedPortfolioProject(project);
    switchView('portfolio-details');
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">

      {/* ================= VIEW: HOME ================= */}
      {currentView === 'home' && (
        <Home switchView={switchView} onProjectClick={handleProjectClick} />
      )}

      {/* ================= VIEW: LOGIN ================= */}
      {currentView === 'login' && (
        <Login switchView={switchView} />
      )}

      {/* ================= VIEW: REGISTER ================= */}
      {currentView === 'register' && (
        <Register switchView={switchView} />
      )}

      {/* ================= VIEW: ADMIN ================= */}
      {currentView === 'admin' && (
        <AdminDashboard />
      )}

      {/* ================= VIEW: MANDOR ================= */}
      {currentView === 'mandor' && (
        <MandorDashboard />
      )}

      {/* ================= VIEW: LAYANAN ================= */}
      {currentView === 'layanan' && (
        <KategoriLayanan switchView={switchView} />
      )}

      {/* ================= VIEW: PORTFOLIO ================= */}
      {currentView === 'portfolio' && (
        <Portofolio switchView={switchView} onProjectClick={handleProjectClick} />
      )}

      {/* ================= VIEW: PORTFOLIO DETAILS ================= */}
      {currentView === 'portfolio-details' && (
        <div className="min-h-screen bg-white font-sans animate-fade-in">
          <Navbar switchView={switchView} currentView="portfolio" />
          <PortofolioDetails switchView={switchView} project={selectedPortfolioProject} onProjectClick={handleProjectClick} />
          <Footer />
        </div>
      )}

      {/* ================= VIEW: ABOUT ================= */}
      {currentView === 'about' && (
        <AboutUsPage switchView={switchView} />
      )}

      {/* ================= VIEW: BOOKING FORM ================= */}
      {currentView === 'booking-form' && (
        <BookingForm switchView={switchView} />
      )}

      {/* ================= VIEW: BOOKING FORM BUSINESS ================= */}
      {currentView === 'booking-form-business' && (
        <BookingFormBusiness switchView={switchView} />
      )}

      {/* ================= VIEW: HANDYMAN SELECTION ================= */}
      {currentView === 'handyman-selection' && (
        <Layanan switchView={switchView} onSelectHandyman={setSelectedHandymanType} />
      )}

      {/* ================= VIEW: BOOKING FORM HANDYMAN ================= */}
      {currentView === 'booking-form-handyman' && (
        <BookingFormHandyman
          switchView={switchView}
          selectedHandymanType={selectedHandymanType}
          selectedMaterials={selectedMaterials}
          onUpdateMaterials={setSelectedMaterials}
        />
      )}

      {/* ================= VIEW: HISTORY ================= */}
      {currentView === 'history' && (
        <HistoryPage switchView={switchView} />
      )}

      {/* ================= VIEW: SERVICE REPAIR BOOKING ================= */}
      {currentView === 'service-repair-booking' && (
        <ServiceRepairBooking switchView={switchView} selectedServiceType={selectedServiceType} />
      )}

      {/* ================= VIEW: REPAIR SERVICE SELECTION ================= */}
      {currentView === 'repair-service-selection' && (
        <RepairServiceSelection switchView={switchView} onSelectService={setSelectedServiceType} />
      )}

      {/* ================= VIEW: MATERIAL SELECTION ================= */}
      {currentView === 'material-selection' && (
        <MaterialSelection
          switchView={switchView}
          initialMaterials={selectedMaterials}
          onSaveMaterials={setSelectedMaterials}
        />
      )}

      {/* Global Floating ChatBot */}
      {currentView !== 'login' && currentView !== 'register' && <ChatBot />}
    </div >
  );
}