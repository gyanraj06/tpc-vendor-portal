import React from 'react';
import { MapPin, Calendar, Home, type LucideIcon } from 'lucide-react';
import type { VendorType } from '../../types';

interface VendorCardProps {
  vendorType: VendorType;
  isSelected: boolean;
  onSelect: (vendorType: VendorType) => void;
}

const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Calendar,
  Home,
};

export const VendorCard: React.FC<VendorCardProps> = ({
  vendorType,
  isSelected,
  onSelect,
}) => {
  const Icon = iconMap[vendorType.icon];

  return (
    <div
      onClick={() => onSelect(vendorType)}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform
        ${isSelected 
          ? 'scale-105 ring-4 ring-brand-green-500/70 shadow-2xl' 
          : 'hover:scale-102 hover:shadow-xl'
        }
        ${vendorType.backgroundGradient}
        min-h-[280px] flex flex-col justify-between p-6 text-white
      `}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Icon size={32} className="text-white" />
          </div>
          {isSelected && (
            <div className="bg-white rounded-full p-2">
              <div className="w-3 h-3 bg-brand-green-500 rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex-grow flex flex-col justify-end">
          <h3 className="text-xl font-semibold mb-3 leading-tight">
            {vendorType.title}
          </h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {vendorType.description}
          </p>
        </div>
      </div>
    </div>
  );
};