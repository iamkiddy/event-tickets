import Link from 'next/link';

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
    { label: 'Greater Accra', href: '/location/accra' },
    { label: 'Kumasi', href: '/location/kumasi' },
    { label: 'Ghana', href: '/location/ghana' },
    { label: 'Nigeria', href: '/location/nigeria' },
    { label: 'Kenya', href: '/location/kenya' },
    { label: 'Uganda', href: '/location/uganda' },
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
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Use CodePass</h3>
            <ul className="space-y-2">
              {footerSections.useEventick.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Plan Events</h3>
            <ul className="space-y-2">
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
            <h3 className="text-white font-semibold mb-4">Top Locations</h3>
            <ul className="space-y-2">
              {footerSections.locations.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
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

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </Link>
              ))}
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} Eventick. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 