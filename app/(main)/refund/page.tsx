'use client';

import { ArrowRight, ShieldCheck, Clock, RefreshCcw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const refundPolicies = [
  {
    icon: ShieldCheck,
    title: "100% Money-Back Guarantee",
    description: "Get a full refund for cancellations made at least 7 days before the event."
  },
  {
    icon: Clock,
    title: "Refund Timeline",
    description: "Refunds are processed within 5-7 business days, depending on your payment method."
  },
  {
    icon: RefreshCcw,
    title: "Flexible Rescheduling",
    description: "Can't make it? Transfer your ticket to another date or event of equal value."
  },
  {
    icon: HelpCircle,
    title: "24/7 Support",
    description: "Our support team is always available to help with refund requests and questions."
  }
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primaryColor/90 to-indigo-800 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] -z-0" />
        <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Our Refund Policy
          </h1>
          <p className="mt-6 text-lg text-white/80">
            We want you to book with confidence. Learn about our transparent refund process and customer protection guarantees.
          </p>
        </div>
      </div>

      {/* Policy Features */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {refundPolicies.map((policy) => (
              <div 
                key={policy.title}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-primaryColor 
                  transition-all hover:shadow-xl"
              >
                <div className="bg-primaryColor/10 rounded-xl p-3 w-fit">
                  <policy.icon className="w-6 h-6 text-primaryColor" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                  {policy.title}
                </h3>
                <p className="text-gray-600">
                  {policy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Policy Section */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Refund Policy Details
          </h2>
          
          <div className="prose prose-indigo max-w-none">
            <h3>Standard Refund Policy</h3>
            <p>
              We offer a full refund for cancellations made at least 7 days before the event date. 
              Cancellations made within 7 days of the event may be eligible for a partial refund, 
              subject to the event organizer's policy.
            </p>

            <h3>Refund Process</h3>
            <p>
              To request a refund, log into your account and navigate to your orders. 
              Select the order you wish to refund and follow the prompts. Refunds will be 
              processed to your original payment method.
            </p>

            <h3>Special Circumstances</h3>
            <p>
              In case of event cancellation by the organizer, all tickets will be automatically 
              refunded in full. For postponed events, tickets will remain valid for the new date, 
              but refunds can be requested if the new date doesn't work for you.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primaryColor to-indigo-800 rounded-3xl p-8 sm:p-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/[0.1] -z-0" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Still have questions?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Our support team is here to help you understand our refund policy
              </p>
              <Link 
                href="/help"
                className="bg-white text-primaryColor px-8 py-4 rounded-xl font-semibold 
                  hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                  inline-flex items-center gap-2 shadow-lg hover:shadow-white/20"
              >
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
