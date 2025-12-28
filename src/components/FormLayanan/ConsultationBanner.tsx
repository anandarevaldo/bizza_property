import React from 'react';
import { ChevronRight, MessageCircle } from 'lucide-react';

interface ConsultationBannerProps {
    onChatWA: () => void;
}

export const ConsultationBanner: React.FC<ConsultationBannerProps> = ({ onChatWA }) => {
    return (
        <div onClick={onChatWA} className="bg-green-50 rounded-2xl p-4 flex items-center justify-between border border-green-100 cursor-pointer hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-base">Bingung hubungi siapa?</p>
                    <p className="text-xs text-gray-500">Konsultasi langsung via WA</p>
                </div>
            </div>
            <button className="text-green-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Chat WA <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};
