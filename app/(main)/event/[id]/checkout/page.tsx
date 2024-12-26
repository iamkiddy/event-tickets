"use client";

import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Phone, 
  Receipt, 
  Shield, 
  ArrowLeft, 
  Calendar,
  MapPin,
  Check,
  Ticket
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

type PaymentMethod = 'card' | 'mobile';

const steps = [
  { id: 'details', label: 'Details', icon: Receipt },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmation', icon: Check }
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generalCount = parseInt(searchParams.get('general') || '0');
  const vipCount = parseInt(searchParams.get('vip') || '0');
  
  const [isAtTop, setIsAtTop] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setIsAtTop(window.scrollY < 10);

    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate totals
  const total = (generalCount * 30) + (vipCount * 50);
  const fees = total * 0.1;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  });
  const [mobileData, setMobileData] = useState({
    phoneNumber: "",
    network: "mtn",
    email: "",
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMobileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3); // Move to confirmation step
    // Add your payment processing logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isAtTop ? 'bg-transparent' : 'bg-white shadow-sm'
      )}>
        <div className="h-16 px-4 flex items-center justify-between max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Secure Checkout</span>
          </div>
        </div>
      </div>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h3>
                <Tabs 
                  defaultValue="card" 
                  className="w-full"
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                >
                  <TabsList className="grid w-full grid-cols-2 gap-4 p-1 mb-8 bg-gray-50 rounded-xl">
                    <TabsTrigger 
                      value="card" 
                      className="flex items-center gap-2.5 py-4 px-6 data-[state=active]:bg-white 
                        data-[state=active]:text-primaryColor data-[state=active]:shadow-sm rounded-lg transition-all
                        hover:bg-gray-100 data-[state=active]:hover:bg-white"
                    >
                      <div className={cn(
                        "p-2 rounded-md transition-colors",
                        "data-[state=active]:bg-primary-50",
                        "bg-white shadow-sm"
                      )}>
                        <CreditCard className="w-5 h-5 text-primaryColor" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Card Payment</span>
                        <span className="text-xs text-gray-500">Pay with Visa or Mastercard</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mobile" 
                      className="flex items-center gap-2.5 py-4 px-6 data-[state=active]:bg-white 
                        data-[state=active]:text-primaryColor data-[state=active]:shadow-sm rounded-lg transition-all
                        hover:bg-gray-100 data-[state=active]:hover:bg-white"
                    >
                      <div className={cn(
                        "p-2 rounded-md transition-colors",
                        "data-[state=active]:bg-primary-50",
                        "bg-white shadow-sm"
                      )}>
                        <Phone className="w-5 h-5 text-primaryColor" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Mobile Money</span>
                        <span className="text-xs text-gray-500">Pay with Mobile Money</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent 
                    value="card" 
                    className="space-y-6 mt-4 animate-in fade-in-50 duration-500"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Card Number</label>
                        <Input
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.cardNumber}
                          onChange={handleCardInputChange}
                          className="h-12 px-4 rounded-lg border-gray-200 focus:border-primaryColor 
                            focus:ring-primaryColor/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                        <Input
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">CVV</label>
                        <Input
                          name="cvv"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                        <Input
                          name="name"
                          placeholder="John Doe"
                          value={cardData.name}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={cardData.email}
                          onChange={handleCardInputChange}
                        />
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent 
                    value="mobile" 
                    className="space-y-6 mt-4 animate-in fade-in-50 duration-500"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-1 gap-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                          <Input
                            name="phoneNumber"
                            placeholder="XX XXX XXXX"
                            value={mobileData.phoneNumber}
                            onChange={handleMobileInputChange}
                            className="h-12 pl-14 pr-4 rounded-lg border-gray-200 focus:border-primaryColor 
                              focus:ring-primaryColor/20 transition-all text-base"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                            +233
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Network Provider</label>
                        <div className="relative">
                          <select
                            name="network"
                            value={mobileData.network}
                            onChange={handleMobileInputChange}
                            className="w-full h-12 pl-11 pr-10 rounded-lg border-gray-200 focus:border-primaryColor 
                              focus:ring-primaryColor/20 focus:ring-2 focus:outline-none bg-white transition-all
                              appearance-none text-base cursor-pointer"
                          >
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="vodafone">Vodafone Cash</option>
                            <option value="airteltigo">AirtelTigo Money</option>
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            {mobileData.network === 'mtn' && (
                              <div className="w-5 h-5 rounded-full bg-yellow-400" />
                            )}
                            {mobileData.network === 'vodafone' && (
                              <div className="w-5 h-5 rounded-full bg-red-500" />
                            )}
                            {mobileData.network === 'airteltigo' && (
                              <div className="w-5 h-5 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg 
                              className="w-5 h-5 text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 9l-7 7-7-7" 
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {mobileData.network === 'mtn' && "You'll receive a prompt on your phone to complete the payment"}
                          {mobileData.network === 'vodafone' && "Enter your Vodafone Cash PIN to complete payment"}
                          {mobileData.network === 'airteltigo' && "You'll receive a USSD prompt to complete payment"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={mobileData.email}
                          onChange={handleMobileInputChange}
                          className="h-12 px-4 rounded-lg border-gray-200 focus:border-primaryColor 
                            focus:ring-primaryColor/20 transition-all text-base"
                        />
                        <p className="text-xs text-gray-500">Your receipt will be sent to this email</p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mt-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <h5 className="font-medium text-gray-900">Payment Instructions</h5>
                            <p className="text-sm text-gray-600 mt-0.5">
                              After clicking pay, you'll receive a prompt on your phone to complete the payment
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Security Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-green-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800">Secure Payment</h5>
                    <p className="text-sm text-green-700 mt-0.5">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-2 text-gray-900 mb-6">
                    <Receipt className="w-5 h-5" />
                    <h4 className="font-semibold">Order Summary</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {generalCount > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-start gap-3">
                          <Ticket className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-gray-900 font-medium">General Admission</span>
                            <p className="text-sm text-gray-500">× {generalCount}</p>
                          </div>
                        </div>
                        <span className="font-medium">GHS {generalCount * 30}</span>
                      </div>
                    )}
                    {vipCount > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-start gap-3">
                          <Ticket className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-gray-900 font-medium">VIP Admission</span>
                            <p className="text-sm text-gray-500">× {vipCount}</p>
                          </div>
                        </div>
                        <span className="font-medium">GHS {vipCount * 50}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-dashed">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Subtotal</span>
                        <span>GHS {total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <span>Service Fee</span>
                        <span>GHS {fees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-lg text-gray-900">
                          GHS {(total + fees).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primaryColor text-white font-medium rounded-xl h-14
                    hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200/50
                    flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                >
                  <Shield className="w-5 h-5" />
                  Pay GHS {(total + fees).toFixed(2)}
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  Your payment information is secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
