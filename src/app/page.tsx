'use client';

import React, { useState } from 'react';
import { Search, ArrowLeft, MapPin, Calendar, CheckCircle, Star, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

import Navbar from './components/navbar';
import Hero from './components/Home/HomeHero';
import ServiceSection from './components/Home/HomeServices';
import Stats from './components/Home/HomeStats';
import Portfolio from './components/Home/HomePortfolio';
import Workflow from './components/Home/HomeWorkflow';
import Review from './components/Home/HomeReview';
import Footer from './components/footer';

import Login from './components/Login/login';
import Register from './components/Login/register';
import AdminDashboard from './components/Admin/dashboard';
// ServicePage removed
import AboutUsPage from './components/About Us/aboutUs';
import ChatBot from './components/ChatBot';

// Service Page Components
import ServiceHero from './components/Layanan/ServiceHero';
import ServiceCategories from './components/Layanan/ServiceCategories';
import ServicePromo from './components/Layanan/ServicePromo';
import ServiceHighlights from './components/Layanan/ServiceHighlights';
import BookingForm from './components/Layanan/Daftar-Layanan/BookingForm';
import BookingFormBusiness from './components/Layanan/Daftar-Layanan/BookingFormBusiness';
import HandymanSelection from './components/Layanan/Daftar-Layanan/HandymanSelection';
import BookingFormHandyman from './components/Layanan/Daftar-Layanan/BookingFormHandyman';
import ServiceRepairBooking from './components/Layanan/Daftar-Layanan/ServiceRepairBooking';
import RepairServiceSelection from './components/Layanan/Daftar-Layanan/RepairServiceSelection';

// Portfolio Page Components
import PortfolioHero from './components/Portfolio/PortfolioHero';
import PortfolioGrid, { Project } from './components/Portfolio/PortfolioGrid';
import PortfolioTestimonials from './components/Portfolio/PortfolioTestimonials';
import PortofolioDetails from './components/Portfolio/PortofolioDetails';

import HistoryPage from './components/History/HistoryPage';

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
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan' | 'portfolio' | 'portfolio-details' | 'about' | 'booking-form' | 'booking-form-business' | 'handyman-selection' | 'booking-form-handyman' | 'history' | 'service-repair-booking' | 'repair-service-selection'>('home');
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('Semua');
  const [selectedPortfolioProject, setSelectedPortfolioProject] = useState<Project | undefined>(undefined);
  const [selectedHandymanType, setSelectedHandymanType] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  const switchView = (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan' | 'portfolio' | 'portfolio-details' | 'about' | 'booking-form' | 'booking-form-business' | 'handyman-selection' | 'booking-form-handyman' | 'history' | 'service-repair-booking' | 'repair-service-selection') => {
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
        <main className="animate-fade-in">
          <Navbar switchView={switchView} currentView="home" />
          <Hero switchView={switchView} />
          <ServiceSection switchView={switchView} />
          <Stats />
          <Portfolio
            activePortfolioCategory={activePortfolioCategory}
            setActivePortfolioCategory={setActivePortfolioCategory}
          />
          <Workflow />
          <Review />
          <Footer />
        </main>
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

      {/* ================= VIEW: LAYANAN ================= */}
      {currentView === 'layanan' && (
        <div className="font-sans animate-fade-in bg-slate-50 text-slate-800">
          <Navbar switchView={switchView} currentView="layanan" />
          <ServiceHero />
          <ServiceCategories switchView={switchView} />
          <ServicePromo />
          <ServiceHighlights switchView={switchView} />
          <Footer />
        </div>
      )}

      {/* ================= VIEW: PORTFOLIO ================= */}
      {currentView === 'portfolio' && (
        <div className="min-h-screen bg-white font-sans animate-fade-in">
          <Navbar switchView={switchView} currentView="portfolio" />
          <PortfolioHero />
          <PortfolioGrid onProjectClick={handleProjectClick} />
          <PortfolioTestimonials />
          <Footer />
        </div>
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
        <HandymanSelection switchView={switchView} onSelectHandyman={setSelectedHandymanType} />
      )}

      {/* ================= VIEW: BOOKING FORM HANDYMAN ================= */}
      {currentView === 'booking-form-handyman' && (
        <BookingFormHandyman switchView={switchView} selectedHandymanType={selectedHandymanType} />
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

      {/* Global Floating ChatBot */}
      {currentView !== 'login' && currentView !== 'register' && <ChatBot />}
    </div >
  );
}