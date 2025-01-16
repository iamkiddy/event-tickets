'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  ScanLine, 
  Ticket,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyPage({ params }: { params: { id: string } }) {
  const [ticketCode, setTicketCode] = useState('');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="-ml-4 text-gray-600 hover:text-gray-900 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>

          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Redeem
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Verify Tickets</h1>
          </div>

          {/* Input Section */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-10" />
              <div className="relative bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter ticket code"
                      value={ticketCode}
                      onChange={(e) => setTicketCode(e.target.value)}
                      className="h-12 pr-10 text-base font-medium placeholder:text-gray-400"
                    />
                    <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <Button 
                    className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <ScanLine className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
