'use client';

import { Music, Moon, Palette, Gift, Heart, Gamepad2, Briefcase, Lollipop } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CategoryProps {
  categories: {
    icon: string;
    name: string;
    totalEvents: number;
  }[];
}

// Map of icon names to Lucide components
const iconMap: { [key: string]: any } = {
  Music,
  Moon,
  Palette,
  Gift,
  Heart,
  Gamepad2,
  Briefcase,
  Lollipop
};

// Array of tailwind color combinations for random selection
const colorCombinations = [
  { bg: 'bg-pink-50', text: 'text-pink-500', hover: 'group-hover:text-pink-600' },
  { bg: 'bg-purple-50', text: 'text-purple-500', hover: 'group-hover:text-purple-600' },
  { bg: 'bg-indigo-50', text: 'text-indigo-500', hover: 'group-hover:text-indigo-600' },
  { bg: 'bg-blue-50', text: 'text-blue-500', hover: 'group-hover:text-blue-600' },
  { bg: 'bg-green-50', text: 'text-green-500', hover: 'group-hover:text-green-600' },
  { bg: 'bg-yellow-50', text: 'text-yellow-500', hover: 'group-hover:text-yellow-600' },
  { bg: 'bg-red-50', text: 'text-red-500', hover: 'group-hover:text-red-600' },
  { bg: 'bg-teal-50', text: 'text-teal-500', hover: 'group-hover:text-teal-600' },
  { bg: 'bg-orange-50', text: 'text-orange-500', hover: 'group-hover:text-orange-600' },
  { bg: 'bg-cyan-50', text: 'text-cyan-500', hover: 'group-hover:text-cyan-600' },
  { bg: 'bg-rose-50', text: 'text-rose-500', hover: 'group-hover:text-rose-600' },
  { bg: 'bg-fuchsia-50', text: 'text-fuchsia-500', hover: 'group-hover:text-fuchsia-600' },
];

export const Categories: React.FC<CategoryProps> = ({ categories }) => {
  const [categoryColors, setCategoryColors] = useState<typeof colorCombinations>([]);

  useEffect(() => {
    // Shuffle color combinations
    const shuffledColors = [...colorCombinations]
      .sort(() => Math.random() - 0.5)
      .slice(0, categories.length);
    setCategoryColors(shuffledColors);
  }, [categories.length]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            const colorCombo = categoryColors[index] || colorCombinations[0];
            
            return (
              <div
                key={category.name}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className={`w-12 h-12 rounded-xl ${colorCombo.bg} flex items-center justify-center 
                      transition-colors duration-300`}
                  >
                    {IconComponent && (
                      <IconComponent 
                        className={`w-6 h-6 ${colorCombo.text} transition-colors duration-300 
                          group-hover:scale-110 transform`} 
                      />
                    )}
                  </div>
                  <h3 
                    className={`font-semibold text-gray-900 ${colorCombo.hover} transition-colors 
                      duration-300`}
                  >
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colorCombo.text}`} />
                  <p className="text-sm text-gray-500">
                    {category.totalEvents} {category.totalEvents === 1 ? 'Event' : 'Events'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};