
import React from 'react';
import { X, Star, ThumbsUp, MessageSquare } from 'lucide-react';

interface Review {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    avatar?: string;
}

const mockReviews: Review[] = [
    { id: '1', userName: 'Bapak Ahmad', rating: 5, date: '10 Des 2025', comment: 'Pekerjaan sangat rapi dan cepat. Orangnya juga sopan. Reccomended banget buat cat rumah!', avatar: 'A' },
    { id: '2', userName: 'Ibu Susi', rating: 4, date: '28 Nov 2025', comment: 'Hasil bagus, cuma agak telat datangnya sedikit. Tapi overall oke kok.', avatar: 'S' },
    { id: '3', userName: 'Pak Hendro', rating: 5, date: '15 Nov 2025', comment: 'Profesional sejati. Paham betul soal kelistrikan. Aman dan safety first.', avatar: 'H' },
];

interface MemberReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    memberName: string;
}

export const MemberReviewsModal: React.FC<MemberReviewsModalProps> = ({ isOpen, onClose, memberName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-gray-900">Ulasan Pengguna</h2>
                            <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-yellow-100">
                                <Star className="w-3 h-3 fill-yellow-600" /> 4.8
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">Review untuk <span className="text-gray-900 font-bold">{memberName}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                {/* Reviews List */}
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {mockReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg shadow-sm">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.userName}</h4>
                                        <p className="text-xs font-bold text-gray-400">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-black text-gray-900 text-sm">{review.rating}</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-4 relative">
                                <MessageSquare className="w-4 h-4 text-gray-200 absolute top-4 right-4" />
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">"{review.comment}"</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> Bermanfaat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors border-2 border-transparent hover:border-gray-100"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
