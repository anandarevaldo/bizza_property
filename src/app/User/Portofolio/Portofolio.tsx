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
    projects: Project[];
}

const Portofolio: React.FC<PortofolioProps> = ({ switchView, onProjectClick, projects }) => {
    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in">
            <Navbar switchView={switchView} currentView="portfolio" />
            <PortfolioHero />
            <PortfolioGrid onProjectClick={onProjectClick} projects={projects} />
            <PortfolioTestimonials />
            <Footer />
        </div>
    );
};

export default Portofolio;
