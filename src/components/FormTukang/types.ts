import { LucideIcon } from 'lucide-react';

export interface BookingFormHandymanProps {
    switchView: (view: any) => void;
    selectedHandymanType: string;
    selectedMaterials?: any[];
    onUpdateMaterials: (materials: any[]) => void;
}

export interface SelectedHandyman {
    id: number;
    type: string;
    quantity: number;
    shift: 'seharian' | 'pagi' | 'sore';
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
    balance?: number;
    description?: string;
}

export interface HandymanType {
    id: string;
    name: string;
    desc: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}
