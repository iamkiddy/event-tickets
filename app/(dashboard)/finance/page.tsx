'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  CreditCard, 
  Plus,
  Wallet,
  Trash2,
  Edit,
  Lock
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
  status: 'active' | 'expired';
}

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  paymentMethod: string;
  status: 'successful' | 'failed' | 'pending';
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'credit_card',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true,
    status: 'active'
  },
  {
    id: 'pm_2',
    type: 'paypal',
    isDefault: false,
    status: 'active'
  },
  {
    id: 'pm_3',
    type: 'credit_card',
    last4: '1234',
    expiryDate: '09/24',
    isDefault: false,
    status: 'expired'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    date: new Date(),
    amount: 49.99,
    description: 'Monthly Subscription',
    paymentMethod: 'Visa •••• 4242',
    status: 'successful'
  },
  {
    id: 'tx_2',
    date: new Date(Date.now() - 86400000),
    amount: 99.99,
    description: 'Premium Plan Upgrade',
    paymentMethod: 'PayPal',
    status: 'successful'
  }
];

export default function PaymentMethodsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: Transaction['status'] | PaymentMethod['status']) => {
    switch (status) {
      case 'successful':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'failed':
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your payment methods and view transactions</p>
        </div>
        <Button className="bg-primaryColor hover:bg-primaryColor/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Methods Section */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Your saved cards and payment accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primaryColor transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {method.type === 'credit_card' ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-[#0070BA] rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {method.type === 'credit_card' 
                          ? `Card ending in ${method.last4}`
                          : 'PayPal Account'}
                        {method.isDefault && (
                          <Badge className="ml-2 bg-primaryColor/10 text-primaryColor border-primaryColor/20">
                            Default
                          </Badge>
                        )}
                      </div>
                      {method.type === 'credit_card' && (
                        <div className="text-sm text-gray-500">
                          Expires {method.expiryDate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.status === 'active' ? (
                      <>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primaryColor">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className={getStatusColor(method.status)}>
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Payment security settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">
                      Additional security for payments over $1000
                    </div>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Last 30 days of activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {format(transaction.date, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount}</div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Limits</CardTitle>
              <CardDescription>Your current payment thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Single Transaction</span>
                  <span className="font-medium">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Monthly Limit</span>
                  <span className="font-medium">$20,000</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Request Limit Increase
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}