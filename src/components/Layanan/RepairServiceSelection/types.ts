import { LucideIcon } from 'lucide-react';
import { ServiceItem } from '@/lib/services/layananService';

export interface ServiceType {
    id: string;
    name: string;
    desc: string;
    icon: any;
    icon_name: string;
    color: string;
    bg: string;
    category?: string;
}

export interface RepairServiceSelectionProps {
    switchView: (view: any) => void;
    onSelectService: (service: string) => void;
    services: ServiceItem[];
}
