import { PaintBucket, Grid3x3, Zap, UserPlus, BoxSelect, Hammer, Wrench, Umbrella, Shovel, Flame, Home, Layers, Droplets, Package } from 'lucide-react';

export interface HandymanType {
    id: string;
    name: string;
    desc: string;
    icon: any;
    color: string;
    bg: string;
}

export const handymanTypes: HandymanType[] = [
    { id: 'cat', name: 'Tukang Cat', desc: 'Bantu membuang cat lama, cat dasar, finishing', icon: PaintBucket, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'keramik', name: 'Tukang Keramik', desc: 'Ahli pasang keramik lantai & dinding', icon: Grid3x3, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'listrik', name: 'Tukang Listrik', desc: 'Instalasi, stop kontak & fitting lampu', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'kenek', name: 'Kenek (Ast. Tukang)', desc: 'Asisten tukang agar pekerjaan cepat selesai', icon: UserPlus, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'aluminium_aksesoris', name: 'Tukang Aluminium Aksesoris', desc: 'Tenaga ahli aksesoris pintu dan jendela', icon: BoxSelect, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'batu', name: 'Tukang Batu', desc: 'Pekerjaan dinding, tembok, batu alam', icon: Hammer, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'pipa', name: 'Tukang Pipa', desc: 'Perbaiki pipa bocor, macet & air bersih', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'waterproofing', name: 'Tukang Waterproofing', desc: 'Betulkan genteng/atap rentan bocor', icon: Umbrella, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'gali', name: 'Tukang Gali', desc: 'Tukang untuk segala keperluan bergali', icon: Shovel, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'besi', name: 'Tukang Besi (Las)', desc: 'Ahlinya permasalahan las besi rumah', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'genteng', name: 'Tukang Genteng', desc: 'Tukang ahli masalah genteng dan atap', icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'plafon', name: 'Tukang Plafon', desc: 'Masalah plafon rusak, berlumut, roboh', icon: Layers, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'sanitair', name: 'Tukang Sanitair', desc: 'Pasang wastafel, kloset, keran, shower', icon: Droplets, color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: 'angkat', name: 'Tukang Angkat', desc: 'Keperluan mengangkat barang rumah', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'listrik_rapih', name: 'Tukang Listrik Perapihan', desc: 'Bongkar, perbaiki kabel listrik & rapikan', icon: Zap, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'pipa_rapih', name: 'Tukang Pipa Perapihan', desc: 'Bongkar, perbaiki pipa & rapikan', icon: Wrench, color: 'text-sky-500', bg: 'bg-sky-50' },
];
