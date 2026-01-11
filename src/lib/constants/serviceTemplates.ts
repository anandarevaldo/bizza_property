
import {
    Droplets, PaintBucket, Grid3x3, Zap, Wrench, Umbrella, PenTool, Layers, Home, DoorOpen, Shield, ChefHat, Building2, Fence, Trees, Shovel, Ruler, Palette, Bath, Package, Blocks, Frame, AirVent, Fan, Gem, Archive, Container, Thermometer, Tent, Square, Sparkles, UserPlus,
    Hammer, Box, Truck, Grid, ShoppingCart, HardHat, CheckCircle, Phone, MessageCircle, Star, Users, Clock, TreeDeciduous, Waves
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ElementType> = {
    'Droplets': Droplets, 'PaintBucket': PaintBucket, 'Grid3x3': Grid3x3, 'Zap': Zap, 'Wrench': Wrench, 'Umbrella': Umbrella, 'PenTool': PenTool, 'Layers': Layers,
    'Home': Home, 'DoorOpen': DoorOpen, 'Shield': Shield, 'ChefHat': ChefHat, 'Building2': Building2, 'Fence': Fence, 'Trees': Trees, 'Shovel': Shovel,
    'Ruler': Ruler, 'Palette': Palette, 'Bath': Bath, 'Package': Package, 'Blocks': Blocks, 'Frame': Frame, 'AirVent': AirVent, 'Fan': Fan,
    'Gem': Gem, 'Archive': Archive, 'Container': Container, 'Thermometer': Thermometer, 'Tent': Tent, 'Square': Square, 'Sparkles': Sparkles, 'UserPlus': UserPlus,
    'Hammer': Hammer, 'Box': Box, 'Truck': Truck, 'Grid': Grid, 'ShoppingCart': ShoppingCart, 'HardHat': HardHat, 'CheckCircle': CheckCircle, 'Phone': Phone,
    'MessageCircle': MessageCircle, 'Star': Star, 'Users': Users, 'Clock': Clock, 'TreeDeciduous': TreeDeciduous, 'Waves': Waves
};

export const COLOR_PRESETS = [
    { name: 'Blue', color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-50 to-blue-100', pattern: '#3b82f6' },
    { name: 'Red', color: 'text-red-600', bg: 'bg-red-50', gradient: 'from-red-50 to-red-100', pattern: '#dc2626' },
    { name: 'Orange', color: 'text-orange-600', bg: 'bg-orange-50', gradient: 'from-orange-50 to-orange-100', pattern: '#ea580c' },
    { name: 'Green', color: 'text-green-600', bg: 'bg-green-50', gradient: 'from-green-50 to-green-100', pattern: '#16a34a' },
    { name: 'Yellow', color: 'text-yellow-600', bg: 'bg-yellow-50', gradient: 'from-yellow-50 to-yellow-100', pattern: '#ca8a04' },
    { name: 'Cyan', color: 'text-cyan-600', bg: 'bg-cyan-50', gradient: 'from-cyan-50 to-cyan-100', pattern: '#0891b2' },
    { name: 'Purple', color: 'text-purple-600', bg: 'bg-purple-50', gradient: 'from-purple-50 to-purple-100', pattern: '#9333ea' },
    { name: 'Pink', color: 'text-pink-600', bg: 'bg-pink-50', gradient: 'from-pink-50 to-pink-100', pattern: '#db2777' },
    { name: 'Gray', color: 'text-gray-600', bg: 'bg-gray-50', gradient: 'from-gray-50 to-gray-100', pattern: '#4b5563' },
];

// Mapping for nice category titles if we want to preserve them
export const CATEGORY_DISPLAY: Record<string, string> = {
    'Popular': '🔥 Paling Sering Dicari',
    'Interior & Finishing': '🏠 Interior & Finishing',
    'Utilitas & Kelistrikan': '⚡ Utilitas & Kelistrikan',
    'Konstruksi & Renovasi Berat': '🏗️ Konstruksi & Renovasi Berat',
    'Eksterior & Halaman': '🌳 Eksterior & Halaman',
    'Lainnya': '🛠️ Lainnya'
};
