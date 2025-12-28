import { LucideIcon } from 'lucide-react';

export interface ServiceType {
    id: string;
    name: string;
    desc: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

export interface RepairServiceSelectionProps {
    switchView: (view: any) => void;
    onSelectService: (service: string) => void;
}
