'use client';

import React from 'react';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';

import PortfolioHero from '../../../components/Portfolio/PortfolioHero';
import PortfolioGrid, { Project } from '../../../components/Portfolio/PortfolioGrid';
import PortfolioTestimonials from '../../../components/Portfolio/PortfolioTestimonials';

interface PortofolioProps {
    switchView: (view: any) => void;
    onProjectClick: (project: Project) => void;
}

const Portofolio: React.FC<PortofolioProps> = ({ switchView, onProjectClick }) => {
    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in">
            <Navbar switchView={switchView} currentView="portfolio" />
            <PortfolioHero />
            <PortfolioGrid onProjectClick={onProjectClick} />
            <PortfolioTestimonials />
            <Footer />
        </div>
    );
};

export default Portofolio;
