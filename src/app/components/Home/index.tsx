import React from 'react';
import Navbar from '../navbar';
import Hero from './hero';
import ServiceSection from './serviceSection';
import Stats from './stats';
import Portfolio from './portofolio';
import Workflow from './workFlow';
import Review from './review';
import Footer from '../footer';

interface HomepageProps {
    switchView: (view: 'home' | 'search' | 'login' | 'admin' | 'layanan') => void;
    activePortfolioCategory: string;
    setActivePortfolioCategory: (category: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ switchView, activePortfolioCategory, setActivePortfolioCategory }) => {
    return (
        <main className="animate-fade-in">
            <Navbar switchView={switchView} />
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
    );
};

export default Homepage;
