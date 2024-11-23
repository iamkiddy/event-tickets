import { Music, Moon, Palette, Gift, Heart, Gamepad2, Briefcase } from 'lucide-react';

const categories = [
  {
    name: 'Music',
    icon: Music,
    color: 'bg-pink-500',
    count: '120 Events'
  },
  {
    name: 'Nightlife',
    icon: Moon,
    color: 'bg-purple-500',
    count: '85 Events'
  },
  {
    name: 'Performing & Visual Arts',
    icon: Palette,
    color: 'bg-blue-500',
    count: '92 Events'
  },
  {
    name: 'Holidays',
    icon: Gift,
    color: 'bg-red-500',
    count: '46 Events'
  },
  {
    name: 'Dating',
    icon: Heart,
    color: 'bg-rose-500',
    count: '73 Events'
  },
  {
    name: 'Hobbies',
    icon: Gamepad2,
    color: 'bg-green-500',
    count: '158 Events'
  },
  {
    name: 'Business',
    icon: Briefcase,
    color: 'bg-indigo-500',
    count: '95 Events'
  }
];

export const Categories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${category.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">{category.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 