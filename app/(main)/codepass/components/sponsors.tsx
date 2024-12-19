import Image from 'next/image';

export const Sponsors = () => {
  const sponsors = [
    {
      name: 'Spotify',
      logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png',
      width: 120
    },
    {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      width: 120
    },
    {
      name: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
      width: 100
    },
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      width: 120
    },
    {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      width: 120
    },
    {
      name: 'IBM',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
      width: 100
    },
    {
      name: 'Salesforce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
      width: 120
    }
  ];

  return (
    <section className="bg-white py-8 sm:py-12 md:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs sm:text-sm text-center text-gray-600 font-medium mb-6 sm:mb-8 md:mb-10">
          TRUSTED BY WORLD-CLASS COMPANIES
        </p>
        <div className="flex justify-center items-center flex-wrap gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-8 sm:gap-y-10 md:gap-y-12">
          {sponsors.map((sponsor) => (
            <div 
              key={sponsor.name}
              className="group relative w-24 sm:w-28 md:w-32"
            >
              <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-to-r from-indigo-100 to-pink-100 
                rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
              <div className="relative opacity-90 hover:opacity-100 
                transition-all duration-300 transform hover:scale-110">
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={sponsor.width}
                  height={40}
                  className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};