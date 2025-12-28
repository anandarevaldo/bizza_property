import React, { useState } from 'react';

import Navbar from '../../../components/navbar';
import Hero from '../../../components/Home/HomeHero';
import ServiceSection from '../../../components/Home/HomeServices';
import Stats from '../../../components/Home/HomeStats';
import Portfolio from '../../../components/Home/HomePortfolio';
import Workflow from '../../../components/Home/HomeWorkflow';
import Review from '../../../components/Home/HomeReview';
import Footer from '../../../components/footer';

interface HomeProps {
    switchView: (view: any) => void;
    onProjectClick: (project: any) => void;
}

const Home: React.FC<HomeProps> = ({ switchView, onProjectClick }) => {
    const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('Semua');

    return (
        <main className="animate-fade-in">
            <Navbar switchView={switchView} currentView="home" />
            <Hero switchView={switchView} />
            <ServiceSection switchView={switchView} />
            <Stats />
            <Portfolio
                activePortfolioCategory={activePortfolioCategory}
                setActivePortfolioCategory={setActivePortfolioCategory}
                switchView={switchView}
                onProjectClick={onProjectClick}
            />
            <Workflow />
            <Review />
            <Footer />
        </main>
    );
};

export default Home;
