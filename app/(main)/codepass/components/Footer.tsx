import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

const footerSections = {
  useEventick: [
    { label: 'Create Events', href: '/create-events' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Event Marketing Platform', href: '/marketing' },
  ],
  planEvents: [
    { label: 'Business & Professional', href: '/category/business' },
    { label: 'Charity & Causes', href: '/category/charity' },
    { label: 'Community & Culture', href: '/category/community' },
    { label: 'Family & Education', href: '/category/education' },
    { label: 'Fashion & Beauty', href: '/category/fashion' },
    { label: 'Food & Drinks', href: '/category/food' },
  ],
    locations: [
      { label: 'Greater Accra', href: null },
    { label: 'Kumasi', href: null },
    { label: 'Ghana', href: null },
    { label: 'Nigeria', href: null },
    { label: 'Kenya', href: null },
    { label: 'Uganda', href: null },
  ],
  support: [
    { label: 'FAQs', href: '/faqs' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact Support', href: '/support' },
  ]
};

const socialLinks = [
  { label: 'X', href: 'https://twitter.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
];

export const Footer = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCreateEventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push('/events/create');
    } else {
      sessionStorage.setItem('previousPath', window.location.pathname);
      router.push('/auth');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-3 xs:mt-5">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-10 sm:py-12">
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xs:gap-8">
          <div className="col-span-2 xs:col-span-1">
            <h3 className="text-white font-semibold text-sm xs:text-base mb-3 xs:mb-4">Use CodePass</h3>
            <ul className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
              {footerSections.useEventick.map((item) => (
                <li key={item.label}>
                  {item.label === 'Create Events' ? (
                    <Link 
                      href="/events/create"
                      onClick={handleCreateEventClick}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm xs:text-base mb-3 xs:mb-4">Plan Events</h3>
            <ul className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
              {footerSections.planEvents.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm xs:text-base mb-3 xs:mb-4">Top Locations</h3>
            <ul className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
              {footerSections.locations.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm xs:text-base mb-3 xs:mb-4">Support</h3>
            <ul className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
              {footerSections.support.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 xs:mt-10 sm:mt-12 pt-6 xs:pt-8 border-t border-gray-800">
          <div className="flex flex-col xs:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center xs:justify-start items-center gap-4 xs:gap-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="hover:text-white transition-colors text-xs xs:text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </Link>
              ))}
            </div>
            <div className="text-xs xs:text-sm text-center xs:text-left">
              © {new Date().getFullYear()} Eventick. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 