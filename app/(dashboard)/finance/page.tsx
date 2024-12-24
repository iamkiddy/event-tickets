import { format } from "date-fns";
import {
  CreditCard,
  Wallet,
  Plus,
  Edit,
  Trash2,
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
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  status: 'successful' | 'pending' | 'failed';
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit_card',
    last4: '4242',
    expiryDate: '12/24',
    isDefault: true,
    status: 'active',
  },
  {
    id: '2',
    type: 'paypal',
    isDefault: false,
    status: 'active',
  },
  {
    id: '3',
    type: 'credit_card',
    last4: '1234',
    expiryDate: '06/23',
    isDefault: false,
    status: 'expired',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Concert Tickets',
    amount: 150,
    date: new Date(),
    paymentMethod: '**** 4242',
    status: 'successful',
  },
  {
    id: '2',
    description: 'Festival Pass',
    amount: 299,
    date: new Date(),
    paymentMethod: 'PayPal',
    status: 'pending',
  },
];

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

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

export default function PaymentMethodsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your payment methods and view transactions</p>
        </div>
        <Button className="w-full sm:w-auto bg-primaryColor hover:bg-primaryColor/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Recent Transactions Section - Left Side */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent payment activity</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Last 30 days</Badge>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'successful' ? 'bg-green-100' : 
                        transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <Wallet className={`w-6 h-6 ${
                          transaction.status === 'successful' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{format(transaction.date, 'MMM d, yyyy')}</span>
                          <span>•</span>
                          <span>{transaction.paymentMethod}</span>
                          <span>•</span>
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-semibold ${
                        transaction.status === 'successful' ? 'text-green-600' :
                        transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPrice(transaction.amount)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(transaction.date, 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Payment Methods Section - Right Side */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your cards & accounts</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        method.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {method.type === 'credit_card' ? (
                          <CreditCard className={`w-5 h-5 ${
                            method.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        ) : (
                          <Wallet className={`w-5 h-5 ${
                            method.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {method.type === 'credit_card'
                              ? `Card ending in ${method.last4}`
                              : 'PayPal'}
                          </p>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        {method.expiryDate && (
                          <p className="text-sm text-gray-500">
                            Expires {method.expiryDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}