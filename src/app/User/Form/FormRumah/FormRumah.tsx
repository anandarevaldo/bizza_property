import React from 'react';
import BookingForm from '../../../../components/FormRumah/BookingForm';

interface FormRumahProps {
    switchView: (view: any) => void;
}

const FormRumah: React.FC<FormRumahProps> = ({ switchView }) => {
    return (
        <BookingForm switchView={switchView} />
    );
};

export default FormRumah;
