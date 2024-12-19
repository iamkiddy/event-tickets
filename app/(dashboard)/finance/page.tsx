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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Payment Methods Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Your saved cards and payment accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {mockPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:border-primaryColor transition-colors gap-4 sm:gap-0"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
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
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
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
        </div>

        {/* Recent Transactions Section */}
        <div>
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Last 30 days of activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-0"
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
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="font-medium">{formatPrice(transaction.amount)}</div>
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
        </div>
      </div>
    </div>
  );
}