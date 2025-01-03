import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Create up to 2 events',
      'Basic analytics',
      'Email support',
      'Basic event customization',
      'Standard ticket types'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '29',
    description: 'Best for professional event organizers',
    features: [
      'Create unlimited events',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'Multiple ticket types',
      'Reserved seating',
      'Custom domain'
    ],
    buttonText: 'Start Pro Plan',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale event management',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'SLA agreement',
      'Advanced security features'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your event management needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.popular ? 'border-primaryColor' : 'border-gray-200'
              } bg-white p-8 shadow-sm flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primaryColor text-white text-sm font-medium rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price === 'Custom' ? 'Custom' : `GHS ${plan.price}`}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-base font-medium text-gray-500">/month</span>
                  )}
                </p>
              </div>

              <ul className="mt-6 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 flex-shrink-0 text-primaryColor" />
                    <span className="ml-3 text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold 
                  ${plan.popular
                    ? 'bg-primaryColor text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                  ${plan.popular ? 'shadow-lg hover:shadow-indigo-200/50' : ''}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-gray-600">
            Need a custom solution? <a href="/contact" className="text-primaryColor hover:text-indigo-700">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
