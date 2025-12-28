import React from 'react';
import LoginHero from '../../../components/Login/LoginHero';
import LoginForm from '../../../components/Login/LoginForm';

interface LoginProps {
    switchView: (view: any) => void;
}

const Login: React.FC<LoginProps> = ({ switchView }) => {
    return (
        <div className="min-h-screen flex animate-fade-in">
            <LoginHero />
            <LoginForm switchView={switchView} />
        </div>
    );
};

export default Login;
