export interface BookingFormProps {
    switchView: (view: any) => void;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
    balance?: number;
    description?: string;
}

export const paymentMethods: PaymentMethod[] = [
    { id: 'gopay', name: 'GoPay', type: 'ewallet', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/gopay_logo_icon_169325.png', balance: 2500000 },
    { id: 'ovo', name: 'OVO', type: 'ewallet', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/ovo_logo_icon_169328.png', balance: 150000 },
    { id: 'dana', name: 'DANA', type: 'ewallet', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/dana_logo_icon_169327.png', balance: 50000 },
    { id: 'bca', name: 'BCA Virtual Account', type: 'va', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/bca_logo_icon_169326.png', description: 'Cek otomatis' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'va', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/mandiri_logo_icon_169329.png', description: 'Cek otomatis' },
];
