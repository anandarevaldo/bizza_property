export interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
    balance?: number;
    description?: string;
}

export interface BookingFormBusinessProps {
    switchView: (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan' | 'portfolio' | 'about' | 'booking-form' | 'booking-form-business') => void;
}

export interface BusinessFormData {
    businessType: string;
    businessName: string;
    picName: string;
    description: string;
    address: {
        search: string;
        detail: string;
    };
    date: Date | null;
    time: string | null;
    budget: string;
    paymentMethod: PaymentMethod | null;
    images: File[];
}
