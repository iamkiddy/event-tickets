import { Music, Moon, Palette, Gift, Heart, Gamepad2, Briefcase } from 'lucide-react';

interface CategoryProps {
  categories: {
    image: string;
    name: string;
    totalEvents: number;
  }[];
}

export const Categories: React.FC<CategoryProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primaryColor transition-colors">
                  {category.name}
                </h3>
              </div>
              <p className="text-sm text-gray-500">{category.totalEvents} Events</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 