'use client';

import React, { useState } from 'react';
import { Search, ArrowLeft, MapPin, Calendar, CheckCircle, Star, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import Homepage from './components/Home/homepage';

import Login from './components/Login/login';
import AdminDashboard from './components/Admin/dashboard';
import ServicePage from './components/Layanan/servicePage';

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
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'login' | 'admin' | 'layanan'>('home');
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('Semua');

  const switchView = (view: 'home' | 'search' | 'login' | 'admin' | 'layanan') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">

      {/* ================= VIEW: HOME ================= */}
      {currentView === 'home' && (
        <Homepage
          switchView={switchView}
          activePortfolioCategory={activePortfolioCategory}
          setActivePortfolioCategory={setActivePortfolioCategory}
        />
      )}

      {/* ================= VIEW: LOGIN ================= */}
      {currentView === 'login' && (
        <Login switchView={switchView} />
      )}

      {/* ================= VIEW: ADMIN ================= */}
      {currentView === 'admin' && (
        <AdminDashboard />
      )}

      {/* ================= VIEW: LAYANAN ================= */}
      {currentView === 'layanan' && (
        <ServicePage switchView={switchView} />
      )}
    </div >
  );
}