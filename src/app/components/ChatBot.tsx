'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronRight } from 'lucide-react';

interface ComponentProps {
    // Optional props if needed for customization later
}

type Message = {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    isTemplate?: boolean;
    showWhatsApp?: boolean;
    showContactOptions?: boolean; // New flag for dual options
};

const TEMPLATE_QUESTIONS = [
    { id: 'services', text: 'Apa saja layanan Bizza?' },
    { id: 'price', text: 'Info Harga & Biaya' },
    { id: 'area', text: 'Area Layanan Bizza?' },
    { id: 'warranty', text: 'Berapa lama garansi?' },
    { id: 'booking', text: 'Cara Booking?' },
    { id: 'payment', text: 'Metode Pembayaran' },
    { id: 'hours', text: 'Jam Operasional' },
    { id: 'other', text: 'Chat Admin / Lainnya' },
];

// Keywords for matching logic
const KEYWORDS = {
    services: ['layanan', 'service', 'jasa', 'renovasi', 'listrik', 'ac', 'plumbing', 'atap', 'lantai', 'menu'],
    warranty: ['garansi', 'jaminan', 'komplain', 'rusak lagi'],
    booking: ['booking', 'pesan', 'order', 'jadwal', 'janji', 'hubungi'],
    price: ['harga', 'biaya', 'tarif', 'ongkos', 'bayar', 'budget'],
    area: ['area', 'lokasi', 'daerah', 'kota', 'jangkauan', 'alamat'],
    payment: ['bayar', 'metode', 'transfer', 'cash', 'kredit', 'cicilan'],
    hours: ['jam', 'buka', 'tutup', 'operasional', 'hari'],
};

const ANSWERS: Record<string, string> = {
    services: 'Bizza Property menyediakan layanan:\n\n1. Renovasi Rumah (Pengecatan, perbaikan atap, lantai, dll)\n2. Ahli Kelistrikan (Instalasi, perbaikan korsleting, tambah daya)\n3. Service AC (Cuci, perbaikan, bongkar pasang)\n4. Plumbing (Pipa bocor, instalasi air)\n\nLayanan kami bergaransi dan dikerjakan oleh teknisi bersertifikat!',
    warranty: 'Kami memberikan Garansi 30 Hari untuk semua pengerjaan service dan renovasi. Jika ada masalah yang sama dalam masa garansi, kami perbaiki GRATIS!',
    booking: 'Cara booking layanan Bizza sangat mudah:\n\n1. Pilih layanan di website\n2. Klik tombol "Pesan Sekarang" atau hubungi kami via WhatsApp\n3. Teknisi kami akan datang sesuai jadwal yang Anda tentukan!',
    price: 'Harga layanan kami transparan dan bervariasi tergantung jenis kerusakan atau pekerjaan. Anda bisa konsultasi gratis terlebih dahulu untuk estimasi biaya. Silakan hubungi admin untuk penawaran terbaik!',
    area: 'Saat ini Bizza Property melayani area JABODETABEK (Jakarta, Bogor, Depok, Tangerang, Bekasi). Kami siap datang ke lokasi Anda!',
    payment: 'Kami menerima pembayaran via Transfer Bank (BCA, Mandiri, BNI) dan E-Wallet (Gopay, OVO, Dana). Pembayaran dilakukan setelah pekerjaan selesai (untuk service kecil).',
    hours: 'Layanan Bizza Property buka setiap hari (Senin - Minggu) pukul 08.00 - 18.00 WIB. Untuk layanan darurat (Khusus Kelistrikan & Pipa Bocor) kami siaga 24 Jam!',
    fallback: 'Maaf, saya hanya bisa menjawab pertanyaan seputar layanan Bizza Property (Renovasi, Kelistrikan, AC, dll). Untuk pertanyaan ini, silakan hubungi Admin kami langsung ya.',
};

const ChatBot: React.FC<ComponentProps> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Halo! Saya Bizzy 👋. Ada yang bisa saya bantu seputar layanan Bizza Property?', sender: 'bot' }
    ]);
    const [showTemplates, setShowTemplates] = useState(true);
    const [inputValue, setInputValue] = useState('');

    // New States for Contact Form Flow
    const [chatMode, setChatMode] = useState<'default' | 'awaiting_message' | 'awaiting_phone'>('default');
    const contactForm = useRef({ message: '', phone: '' });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleTemplateClick = (option: typeof TEMPLATE_QUESTIONS[0]) => {
        const userMsg: Message = { id: Date.now(), text: option.text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setShowTemplates(false); // Hide templates after selection

        setTimeout(() => {
            if (option.id === 'other') {
                const botMsg: Message = {
                    id: Date.now() + 1,
                    text: 'Untuk pertanyaan lebih detail atau konsultasi khusus, Anda bisa langsung terhubung dengan Admin kami via WhatsApp ya! 👇',
                    sender: 'bot',
                    showWhatsApp: true
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                const answer = ANSWERS[option.id];
                const botMsg: Message = {
                    id: Date.now() + 1,
                    text: answer,
                    sender: 'bot'
                };
                setMessages(prev => [...prev, botMsg]);
            }
        }, 600);
    };

    const handleContactAdminClick = () => {
        setChatMode('awaiting_message');
        const botMsg: Message = {
            id: Date.now(),
            text: 'Baik, silakan tulis pesan yang ingin Anda sampaikan kepada Admin/Owner Bizza Property:',
            sender: 'bot'
        };
        setMessages(prev => [...prev, botMsg]);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        const userMsg: Message = { id: Date.now(), text: userText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setShowTemplates(false);

        // --- CONTACT FORM FLOW ---
        if (chatMode === 'awaiting_message') {
            contactForm.current.message = userText;
            setChatMode('awaiting_phone');
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: 'Terima kasih. Terakhir, mohon informasikan Nomor WhatsApp/HP yang bisa kami hubungi:',
                    sender: 'bot'
                }]);
            }, 500);
            return;
        }

        if (chatMode === 'awaiting_phone') {
            contactForm.current.phone = userText;
            setChatMode('default');
            setTimeout(() => {
                // In a real app, this would send data to backend
                console.log('Form Submitted:', contactForm.current);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: '✅ Pesan Anda telah kami terima dan disalurkan ke Owner Bizza Property. Kami akan segera menghubungi Anda melalui nomor tersebut. Terima kasih!',
                    sender: 'bot'
                }]);
                // Reset form
                contactForm.current = { message: '', phone: '' };
            }, 600);
            return;
        }

        // --- NORMAL CHAT FLOW ---
        // Simple keyword matching logic
        const lowerText = userText.toLowerCase();
        let matchedKey = '';

        // Check against categories
        if (KEYWORDS.services.some(k => lowerText.includes(k))) matchedKey = 'services';
        else if (KEYWORDS.warranty.some(k => lowerText.includes(k))) matchedKey = 'warranty';
        else if (KEYWORDS.booking.some(k => lowerText.includes(k))) matchedKey = 'booking';
        else if (KEYWORDS.price.some(k => lowerText.includes(k))) matchedKey = 'price';
        else if (KEYWORDS.area.some(k => lowerText.includes(k))) matchedKey = 'area';
        else if (KEYWORDS.payment.some(k => lowerText.includes(k))) matchedKey = 'payment';
        else if (KEYWORDS.hours.some(k => lowerText.includes(k))) matchedKey = 'hours';

        setTimeout(() => {
            if (matchedKey) {
                // If matched topic, answer
                const botMsg: Message = {
                    id: Date.now() + 1,
                    text: ANSWERS[matchedKey],
                    sender: 'bot'
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                // If NO match (fallback), show Advanced Options
                const botMsg: Message = {
                    id: Date.now() + 1,
                    text: 'Maaf, saya kurang mengerti pertanyaan tersebut. Namun jangan khawatir, Anda bisa menghubungi Admin kami secara langsung melalui chat ini (disalurkan ke Owner), atau melalui WhatsApp.',
                    sender: 'bot',
                    showContactOptions: true // Trigger dual options
                };
                setMessages(prev => [...prev, botMsg]);
            }
        }, 600);
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = '628123456789'; // Placeholder
        const message = encodeURIComponent('Halo Admin Bizza Property, saya melihat website anda dan ingin bertanya mengenai...');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const resetChat = () => {
        setMessages([
            { id: 1, text: 'Halo! Saya Bizzy 👋. Ada yang bisa saya bantu seputar layanan Bizza Property?', sender: 'bot' }
        ]);
        setShowTemplates(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isOpen ? (
                    <X className="w-8 h-8 text-white" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-8 h-8 text-white" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`absolute bottom-20 right-0 w-[90vw] md:w-[22rem] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right transform flex flex-col max-h-[32rem] ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center gap-3 flex-shrink-0">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Bizzy</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-blue-100 text-xs font-medium">Online • Asisten Virtual</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 min-h-[16rem]">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-slate-700 border border-gray-100 rounded-bl-none'
                                    }`}
                            >
                                <div className="whitespace-pre-line">
                                    {msg.text}
                                </div>

                                {/* Show WhatsApp button only for specific messages */}
                                {/* Show WhatsApp button only for specific messages */}
                                {msg.showWhatsApp && (
                                    <div className="mt-3 pt-2 border-t border-slate-100">
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Hubungi Admin via WhatsApp</span>
                                        </button>
                                    </div>
                                )}

                                {/* Show Dual Contact Options */}
                                {msg.showContactOptions && (
                                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-2">
                                        <button
                                            onClick={handleContactAdminClick}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                        >
                                            <Bot className="w-4 h-4" />
                                            <span>Hubungi Admin (via Chat)</span>
                                        </button>
                                        <div className="relative flex items-center py-1">
                                            <div className="flex-grow border-t border-gray-200"></div>
                                            <span className="flex-shrink-0 mx-2 text-[10px] text-gray-400 font-bold uppercase">Atau Alternatif</span>
                                            <div className="flex-grow border-t border-gray-200"></div>
                                        </div>
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                            <span>Chat WhatsApp</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Interaction Area: Template Only OR Input */}
                <div className="bg-white border-t border-gray-100 flex-shrink-0">
                    {showTemplates ? (
                        <div className="p-3 border-b border-gray-50 bg-slate-50/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 px-1">Topik Populer:</p>
                            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                                {TEMPLATE_QUESTIONS.map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => handleTemplateClick(q)}
                                        className="text-xs bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                                    >
                                        {q.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center bg-slate-50/30 border-b border-slate-50 py-2">
                            <button
                                onClick={() => setShowTemplates(true)}
                                className="text-blue-600 text-[10px] font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                                <span>Tampilkan Topik Populer</span>
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Input Field */}
                    <form onSubmit={handleSendMessage} className="p-3 flex gap-2 items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Tulis pertanyaan..."
                            className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-md shadow-blue-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="px-3 pb-2 flex justify-between items-center bg-white">
                        <span className="text-[10px] text-gray-300">Bizza AI Assistant</span>
                        {messages.length > 1 && (
                            <button
                                onClick={resetChat}
                                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
