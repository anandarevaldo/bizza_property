
import React, { useState } from 'react';
import { Plus, Search, Trash2, Image, ExternalLink, Edit2, Layers } from 'lucide-react';
import { PortfolioEditModal } from './PortfolioEditModal';

export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    category: string;
    images: string[];
    date: string;
}

const initialPortfolio: PortfolioItem[] = [
    { id: '1', title: 'Renovasi Rumah Minimalis', description: 'Renovasi total rumah tipe 36 menjadi 2 lantai konsep minimalis.', category: '🏗️ Konstruksi & Renovasi Berat', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600'], date: '2025-10-15' },
    { id: '2', title: 'Pemasangan Kanopi Carport', description: 'Instalasi kanopi baja ringan dengan atap alderon.', category: '🌳 Eksterior & Halaman', images: ['https://images.unsplash.com/photo-1623861282103-62d08a462319?auto=format&fit=crop&q=80&w=600'], date: '2025-11-02' },
    { id: '3', title: 'Makeover Kamar Mandi', description: 'Ganti keramik dan instalasi sanitary baru.', category: '🏠 Interior & Finishing', images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=600'], date: '2025-12-01' },
];

export const PortfolioList: React.FC = () => {
    const [items, setItems] = useState<PortfolioItem[]>(initialPortfolio);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm('Hapus portofolio ini?')) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const handleEdit = (item: PortfolioItem) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    const handleSave = (data: Partial<PortfolioItem>) => {
        if (currentItem) {
            // Edit Mode
            setItems(items.map(i => i.id === currentItem.id ? { ...i, ...data } as PortfolioItem : i));
        } else {
            // Add Mode
            const item: PortfolioItem = {
                ...data as PortfolioItem,
                id: Math.random().toString(36).substr(2, 9),
            };
            setItems([...items, item]);
        }
        setIsModalOpen(false);
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-pink-50 rounded-2xl text-pink-600">
                            <Image className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Portofolio</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Galeri hasil pengerjaan proyek untuk showcase.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Portofolio
                </button>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari judul proyek..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                    <div key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-2 relative flex flex-col h-full">
                        {/* Edit & Delete Actions Absolute */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-2.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:scale-110 transition-all shadow-sm"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:scale-110 transition-all shadow-sm"
                                title="Hapus"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={item.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-2 shadow-lg">
                                    {item.category.split(' ').slice(1).join(' ')} {/* Trim emoji roughly */}
                                </span>
                                {item.images && item.images.length > 1 && (
                                    <div className="absolute bottom-1 right-0 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-md text-xs font-bold">
                                        <Layers className="w-3 h-3" />
                                        +{item.images.length - 1}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <div className="mb-3">
                                <h3 className="font-bold text-gray-900 text-xl leading-snug mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                <p className="text-xs text-gray-400 font-bold bg-gray-50 inline-block px-2 py-1 rounded-md">{item.date}</p>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                        </div>
                    </div>
                ))}

                {/* Upload Placeholder */}
                <button
                    onClick={handleOpenAdd}
                    className="h-full min-h-[300px] border-3 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all gap-4 group"
                >
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Tambah Proyek Baru</span>
                </button>
            </div>

            <PortfolioEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                portfolio={currentItem}
                onSave={handleSave}
            />
        </div>
    );
};
