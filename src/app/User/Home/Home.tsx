import React, { useState } from 'react';

import Navbar from '../../../components/navbar';
import Hero from '../../../components/Home/HomeHero';
import ServiceSection from '../../../components/Home/HomeServices';
import Stats from '../../../components/Home/HomeStats';
import Portfolio from '../../../components/Home/HomePortfolio';
import Workflow from '../../../components/Home/HomeWorkflow';
import Review from '../../../components/Home/HomeReview';
import Footer from '../../../components/footer';

import { Project } from '../../../components/Portfolio/PortfolioGrid';

interface HomeProps {
    onProjectClick: (project: any) => void;
    projects: Project[];
}

const Home: React.FC<HomeProps> = ({ onProjectClick, projects }) => {
    const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('Semua');

    return (
        <main className="animate-fade-in">
            <Navbar currentView="home" />
            <Hero />
            <ServiceSection />
            <Stats />
            <Portfolio
                activePortfolioCategory={activePortfolioCategory}
                setActivePortfolioCategory={setActivePortfolioCategory}
                onProjectClick={onProjectClick}
                projects={projects}
            />
            <Workflow />
            <Review />
            <Footer />
        </main>
    );
};

export default Home;
