import Image from 'next/image';
import { ArrowRight, BarChart, Globe, Users, Mail, Target, Megaphone } from 'lucide-react';

const marketingFeatures = [
  {
    icon: Globe,
    title: 'Social Media Integration',
    description: 'Seamlessly promote your events across all major social media platforms with automated posting and scheduling.'
  },
  {
    icon: BarChart,
    title: 'Analytics & Insights',
    description: 'Track your marketing performance with detailed analytics on ticket sales, engagement rates, and audience demographics.'
  },
  {
    icon: Users,
    title: 'Audience Targeting',
    description: 'Reach the right audience with advanced targeting options based on interests, location, and past event attendance.'
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Create and send beautiful email campaigns with our drag-and-drop editor and pre-built templates.'
  },
  {
    icon: Target,
    title: 'Retargeting Campaigns',
    description: 'Re-engage potential attendees with smart retargeting campaigns across multiple platforms.'
  },
  {
    icon: Megaphone,
    title: 'Promotional Tools',
    description: 'Access a suite of promotional tools including custom landing pages, promo codes, and early bird specials.'
  }
];

export default function MarketingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-primaryColor/90 to-indigo-800 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] -z-0" />
        <div className="absolute inset-y-0 right-0 -z-10">
          <svg className="h-full w-48 text-white/5" viewBox="0 0 100 100">
            {/* Add decorative pattern */}
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Transform Your Event Marketing
              </h1>
              <p className="mt-6 text-lg text-white/80">
                Our comprehensive event marketing platform helps you promote your events, 
                reach the right audience, and boost ticket sales with powerful tools and analytics.
              </p>
              <div className="mt-8 flex gap-4">
                <button className="bg-white text-primaryColor px-6 py-3 rounded-xl font-semibold 
                  hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                  shadow-lg hover:shadow-white/20">
                  Get Started
                </button>
                <button className="text-white border-2 border-white/20 px-6 py-3 rounded-xl font-semibold 
                  hover:bg-white/10 transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                alt="Marketing Dashboard"
                fill
                className="object-cover"
                priority
              />
              {/* Floating Stats Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primaryColor">50K+</p>
                    <p className="text-sm text-gray-600">Daily Views</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-2xl font-bold text-primaryColor">89%</p>
                    <p className="text-sm text-gray-600">Conversion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primaryColor">24/7</p>
                    <p className="text-sm text-gray-600">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Enhanced Cards */}
      <div className="py-20 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to market your events
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful tools to help you reach more attendees and sell more tickets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketingFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-primaryColor 
                  transition-all hover:shadow-xl group cursor-pointer"
              >
                <div className="bg-primaryColor/10 rounded-xl p-3 w-fit group-hover:bg-primaryColor/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primaryColor" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Enhanced Design */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-primaryColor to-indigo-800 rounded-3xl p-8 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.1] -z-0" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to boost your event's visibility?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join thousands of event organizers who are growing their audiences with our marketing platform
              </p>
              <button className="bg-white text-primaryColor px-8 py-4 rounded-xl font-semibold 
                hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                inline-flex items-center gap-2 shadow-lg hover:shadow-white/20">
                Start Marketing Your Event
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
