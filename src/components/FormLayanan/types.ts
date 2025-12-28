export interface ServiceRepairBookingProps {
    switchView: (view: any) => void;
    selectedServiceType?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
    balance?: number;
    description?: string;
}

export interface ProblemType {
    id: string;
    label: string;
}
