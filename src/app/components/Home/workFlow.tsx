
import React from 'react';
import { Search, Calendar, UserCheck, CheckCircle } from 'lucide-react';

const Workflow = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900">Alur Pemesanan Jasa</h2>
                <p className="text-gray-500 mb-16 text-lg max-w-2xl mx-auto">Proses sederhana untuk hasil yang memuaskan</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Line connector for desktop */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-1 bg-blue-100 -z-10 rounded-full" />

                    {/* Step 1 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
                        <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-blue-50 to-blue-100">
                            <Search className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-800">Identifikasi Kebutuhan</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Pilih jenis layanan dan keluhan yang Anda alami</p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
                        <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-red-50 to-red-100">
                            <Calendar className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-800">Jadwal & Survei</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Tentukan waktu kunjungan untuk estimasi</p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
                        <div className="w-20 h-20 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-yellow-50 to-yellow-100">
                            <UserCheck className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-800">Eksekusi Pekerjaan</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Mitra profesional kami bekerja sesuai standar SOP</p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
                        <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-green-50 to-green-100">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-800">Serah Terima & Garansi</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Pembayaran aman dengan jaminan garansi retensi</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
