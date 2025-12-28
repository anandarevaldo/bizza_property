
import React from 'react';
import BookingFormHandyman from '../../../../components/FormTukang/BookingFormHandyman';

interface FormTukangProps {
    switchView: (view: any) => void;
    selectedHandymanType: string;
    selectedMaterials?: any[];
    onUpdateMaterials: (materials: any[]) => void;
}

const FormTukang: React.FC<FormTukangProps> = (props) => {
    return (
        <BookingFormHandyman {...props} />
    );
}

export default FormTukang;
