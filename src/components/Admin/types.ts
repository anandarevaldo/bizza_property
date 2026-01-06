
export interface Mandor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    location: string;
    detailedLocation?: string;
    phone: string;
    status: 'Available' | 'Busy' | 'Off';
    totalProjects: number;
}
