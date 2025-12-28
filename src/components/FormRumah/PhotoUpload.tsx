import React, { useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploadProps {
    images: File[];
    onImagesChange: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ images, onImagesChange, onRemoveImage }) => {
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Assuming the parent handles the limit, but we can do it here too just in case or rely on parent
            // The original logic limits to 10.
            onImagesChange(newFiles);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Masukkan Foto Masalah
            </h2>
            <p className="text-gray-500 text-sm mb-6 ml-7">Maksimal foto diupload adalah 10 foto</p>

            <div className="flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 hover:bg-blue-100/50 hover:border-blue-300 transition-all cursor-pointer group" onClick={() => galleryInputRef.current?.click()}>
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100">
                    <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-800">Upload dari Device</p>
                    <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (Max 5MB)</p>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={galleryInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {images.map((file, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => onRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
