export interface BookingFormProps {
    switchView: (view: any) => void;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
}

