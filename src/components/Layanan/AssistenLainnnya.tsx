import React from 'react';
import HandymanCard from './HandymanCard';
import { handymanTypes, HandymanType } from './data';

interface AssistenLainnnyaProps {
    onSelectHandyman: (name: string) => void;
}

const AssistenLainnnya: React.FC<AssistenLainnnyaProps> = ({ onSelectHandyman }) => {
    const ids = ['kenek', 'angkat'];
    const items = handymanTypes.filter((h: HandymanType) => ids.includes(h.id));

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🤝 Asisten & Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item: HandymanType) => (
                    <HandymanCard key={item.id} item={item} onClick={() => onSelectHandyman(item.name)} />
                ))}
            </div>
        </div>
    );
};

export default AssistenLainnnya;
