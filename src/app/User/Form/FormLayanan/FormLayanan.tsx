
import React from 'react';
import ServiceRepairBooking from '../../../../components/FormLayanan/ServiceRepairBooking';

interface FormLayananProps {
    switchView: (view: any) => void;
    selectedServiceType?: string;
}

const FormLayanan: React.FC<FormLayananProps> = ({ switchView, selectedServiceType }) => {
    return (
        <ServiceRepairBooking switchView={switchView} selectedServiceType={selectedServiceType} />
    );
};

export default FormLayanan;
