"use client";

import { Input } from "@/components/ui/input";
import { CreditCard, Phone, X, Receipt, Shield } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface CheckoutModalProps {
  total: number;
  generalCount: number;
  vipCount: number;
  fees: number;
  eventTitle: string;
  onClose: () => void;
}

type PaymentMethod = 'card' | 'mobile';

export function CheckoutModal({ 
  total, 
  generalCount, 
  vipCount, 
  fees, 
  eventTitle,
  onClose
}: CheckoutModalProps) {
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
    console.log("Processing payment:", paymentMethod === 'card' ? cardData : mobileData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl max-w-[95vw] md:max-w-[600px] w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col h-[90vh] md:h-[600px]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Checkout</h3>
              <p className="text-sm text-gray-500 mt-1">Complete your purchase securely</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 space-y-3 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-900">
                  <Receipt className="w-5 h-5" />
                  <h4 className="font-semibold">Order Summary</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600 font-medium">{eventTitle}</div>
                  {generalCount > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">General Admission × {generalCount}</span>
                      <span className="font-medium">GHS {generalCount * 30}</span>
                    </div>
                  )}
                  {vipCount > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">VIP Admission × {vipCount}</span>
                      <span className="font-medium">GHS {vipCount * 50}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1 border-t">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">GHS {fees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t text-lg">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">GHS {(total + fees).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <Tabs 
                defaultValue="card" 
                className="w-full"
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-xl">
                  <TabsTrigger 
                    value="card" 
                    className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    Card Payment
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mobile" 
                    className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Mobile Money
                  </TabsTrigger>
                </TabsList>

                {/* Card Payment Form */}
                <TabsContent value="card" className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative group">
                      <Input
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="pl-10 h-12 transition-all border-gray-200 focus:border-primaryColor group-hover:border-gray-300"
                        value={cardData.cardNumber}
                        onChange={handleCardInputChange}
                        required={paymentMethod === 'card'}
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <Input
                        name="expiryDate"
                        placeholder="MM/YY"
                        className="h-12 transition-all border-gray-200 focus:border-primaryColor hover:border-gray-300"
                        value={cardData.expiryDate}
                        onChange={handleCardInputChange}
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input
                        name="cvv"
                        placeholder="123"
                        className="h-12 transition-all border-gray-200 focus:border-primaryColor hover:border-gray-300"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <Input
                      name="name"
                      placeholder="John Doe"
                      className="h-12 transition-all border-gray-200 focus:border-primaryColor hover:border-gray-300"
                      value={cardData.name}
                      onChange={handleCardInputChange}
                      required={paymentMethod === 'card'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 transition-all border-gray-200 focus:border-primaryColor hover:border-gray-300"
                      value={cardData.email}
                      onChange={handleCardInputChange}
                      required={paymentMethod === 'card'}
                    />
                  </div>
                </TabsContent>

                {/* Mobile Money Form */}
                <TabsContent value="mobile" className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Network
                    </label>
                    <select
                      name="network"
                      value={mobileData.network}
                      onChange={handleMobileInputChange}
                      className="w-full h-12 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent hover:border-gray-300 transition-all"
                      required={paymentMethod === 'mobile'}
                    >
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="vodafone">Vodafone Cash</option>
                      <option value="airteltigo">AirtelTigo Money</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Input
                        name="phoneNumber"
                        placeholder="0XX XXX XXXX"
                        className="pl-10 h-12 transition-all border-gray-200 focus:border-primaryColor group-hover:border-gray-300"
                        value={mobileData.phoneNumber}
                        onChange={handleMobileInputChange}
                        required={paymentMethod === 'mobile'}
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (for receipt)
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 transition-all border-gray-200 focus:border-primaryColor hover:border-gray-300"
                      value={mobileData.email}
                      onChange={handleMobileInputChange}
                      required={paymentMethod === 'mobile'}
                    />
                  </div>

                  <div className="rounded-xl bg-blue-50 p-6 text-sm text-blue-700 space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <Shield className="w-5 h-5" />
                      Payment Instructions
                    </div>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Enter your mobile money number above</li>
                      <li>You will receive a prompt on your phone</li>
                      <li>Enter your PIN to complete the payment</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primaryColor text-white font-medium rounded-xl h-14
                  hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200/50
                  flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Pay GHS {(total + fees).toFixed(2)} with {paymentMethod === 'card' ? 'Card' : 'Mobile Money'}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                Your payment information is secure and encrypted
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
