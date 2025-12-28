import React from 'react';
import RegisterHero from '../../../components/Register/RegisterHero';
import RegisterForm from '../../../components/Register/RegisterForm';

interface RegisterProps {
    switchView: (view: any) => void;
}

const Register: React.FC<RegisterProps> = ({ switchView }) => {
    return (
        <div className="min-h-screen flex animate-fade-in">
            <RegisterHero />
            <RegisterForm switchView={switchView} />
        </div>
    );
};

export default Register;
