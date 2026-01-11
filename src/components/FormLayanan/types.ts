export interface ServiceRepairBookingProps {
    switchView: (view: any) => void;
    selectedServiceType?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
}

export interface ProblemType {
    id: string;
    label: string;
    handymanType: string; // e.g., 'Tukang Atap', 'Tukang Pipa'
    needsKenek?: boolean; // Recommendation flag
}
