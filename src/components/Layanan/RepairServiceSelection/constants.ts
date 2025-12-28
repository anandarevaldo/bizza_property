import {
    Droplets, PaintBucket, Grid3x3, Zap, Wrench, Umbrella, PenTool, Layers, Home, DoorOpen, Shield, ChefHat, Building2, Fence, Trees, Shovel, Ruler, Palette, Bath, Package, Blocks, Frame, AirVent, Fan, Gem, Archive, Container, Thermometer, Tent, Square, Sparkles, UserPlus
} from 'lucide-react';
import { ServiceType } from './types';

export const serviceTypes: ServiceType[] = [
    { id: '1', name: 'Kebocoran', desc: 'Jaga Rumah Bebas Bocor', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: '2', name: 'Cat', desc: 'Warnai Rumahmu', icon: PaintBucket, color: 'text-red-600', bg: 'bg-red-50' },
    { id: '3', name: 'Keramik', desc: 'Percantik Lantai & Dinding', icon: Grid3x3, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: '4', name: 'Listrik', desc: 'Rumah Terang, Hati Senang', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: '5', name: 'Pipa', desc: 'Air Mengalir Lancar', icon: Wrench, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: '6', name: 'Sanitasi', desc: 'Kamar Mandi Bersih', icon: Umbrella, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: '7', name: 'Konsultan', desc: 'Bantu Rencanakan Proyek', icon: PenTool, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: '8', name: 'Plafon', desc: 'Perbaikan Langit-langit', icon: Layers, color: 'text-gray-600', bg: 'bg-gray-50' },
    { id: '9', name: 'Dinding', desc: 'Dinding Kokoh Terjaga', icon: Home, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: '10', name: 'Pintu', desc: 'Kreasi Pintu & Jendela', icon: DoorOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: '11', name: 'Atap', desc: 'Pelindung Rumahmu', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50' },
    { id: '12', name: 'Dapur', desc: 'Semangat Memasak', icon: ChefHat, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: '13', name: 'Konstruksi', desc: 'Bangun Rumah Impian', icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: '14', name: 'Pagar', desc: 'Keamanan Properti', icon: Fence, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: '15', name: 'Taman', desc: 'Landscape & Taman', icon: Trees, color: 'text-lime-600', bg: 'bg-lime-50' },
    { id: '16', name: 'Pondasi', desc: 'Struktur Kuat Kokoh', icon: Shovel, color: 'text-stone-600', bg: 'bg-stone-50' },
    { id: '17', name: 'Desain', desc: 'Rancang Hunianmu', icon: Ruler, color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: '18', name: 'Interior', desc: 'Desain Interior Elegan', icon: Palette, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    { id: '19', name: 'Toilet', desc: 'Kamar Mandi Nyaman', icon: Bath, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: '20', name: 'Jasa Angkat', desc: 'Pindahkan Barangmu', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: '21', name: 'Conblock', desc: 'Pekarangan Rumah Indah', icon: Blocks, color: 'text-green-600', bg: 'bg-green-50' },
    { id: '22', name: 'Aluminium', desc: 'Percantik Interior', icon: Frame, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: '23', name: 'Exhaust Fan', desc: 'Udara Ruangan Segar', icon: AirVent, color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: '24', name: 'Kipas Angin', desc: 'Rumahmu Lebih Adem', icon: Fan, color: 'text-red-500', bg: 'bg-red-50' },
    { id: '25', name: 'Batu Alam', desc: 'Sentuhan Alam Alami', icon: Gem, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: '26', name: 'Lemari', desc: 'Jaga Barang Pentingmu', icon: Archive, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: '27', name: 'Tangki Air', desc: 'Pasang Tangki Air', icon: Container, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: '28', name: 'Water Heater', desc: 'Air Hangat Nyaman', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: '29', name: 'Kanopi', desc: 'Lindungi Area Luar', icon: Tent, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: '30', name: 'Lantai', desc: 'Lantai Rumah Mulus', icon: Square, color: 'text-stone-500', bg: 'bg-stone-50' },
    { id: '31', name: 'Cuci Toren', desc: 'Air Bersih Mengalir', icon: Sparkles, color: 'text-sky-500', bg: 'bg-sky-50' },
    { id: '32', name: 'Kenek', desc: 'Bantu Pekerjaan Cepat', icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export const categories = {
    popular: {
        title: "🔥 Paling Sering Dicari",
        ids: ['1', '4', '2', '5', '11', '19']
    },
    interior: {
        title: "🏠 Interior & Finishing",
        ids: ['3', '8', '9', '10', '30', '18', '22', '17', '12', '26']
    },
    utilities: {
        title: "⚡ Utilitas & Kelistrikan",
        ids: ['6', '23', '24', '28', '27', '31']
    },
    construction: {
        title: "🏗️ Konstruksi & Renovasi Berat",
        ids: ['13', '16', '25', '7', '21']
    },
    exterior: {
        title: "🌳 Eksterior & Halaman",
        ids: ['14', '15', '29', '11']
    },
    other: {
        title: "🛠️ Lainnya",
        ids: ['20', '32']
    }
};
