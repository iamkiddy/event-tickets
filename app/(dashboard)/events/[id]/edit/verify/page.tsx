'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  ScanLine, 
  Ticket,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { verifyTicket, redeemSingleTicket, redeemAllTickets } from '@/lib/actions/orders';
import { toast } from 'sonner';
import { VerifyTicketResponse } from '@/lib/models/_orders_models';

export default function VerifyPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifyTicketResponse | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const handleVerify = async () => {
    if (!ticketCode.trim()) {
      toast.error('Please enter a ticket code');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyTicket(eventId, ticketCode);
      setVerificationResult(result);
      if (result.isRefunded) {
        toast.error('This ticket has been refunded');
      } else {
        toast.success('Ticket verified successfully');
      }
    } catch (error) {
      toast.error('Failed to verify ticket');
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRedeem = async (ticketId: string) => {
    setIsRedeeming(true);
    try {
      // Find the ticket by ID to get its code
      const ticketToRedeem = verificationResult?.tickets.find(t => t.id === ticketId);
      if (!ticketToRedeem) {
        throw new Error('Ticket not found');
      }

      // Pass individual ticket code first, then the main ticket code from input
      const result = await redeemSingleTicket(
        ticketToRedeem.ticketCode,  // ticket_code parameter
        ticketCode                  // order_code parameter (from input field)
      );
      
      toast.success('Ticket redeemed successfully');
      // Refresh verification data
      const updatedResult = await verifyTicket(eventId, ticketCode);
      setVerificationResult(updatedResult);
    } catch (error) {
      toast.error('Failed to redeem ticket');
      console.error('Redemption error:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleRedeemAll = async () => {
    setIsRedeeming(true);
    try {
      const result = await redeemAllTickets(ticketCode, eventId);
      toast.success('All tickets redeemed successfully');
      // Refresh verification data
      const updatedResult = await verifyTicket(eventId, ticketCode);
      setVerificationResult(updatedResult);
    } catch (error) {
      toast.error('Failed to redeem tickets');
      console.error('Bulk redemption error:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

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
                    onClick={handleVerify}
                    disabled={isVerifying || !ticketCode.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ScanLine className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className="max-w-md mx-auto mt-8">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Ticket Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium truncate">{verificationResult.id}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{verificationResult.customerName}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${
                        verificationResult.isRefunded ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {verificationResult.isRefunded ? 'Refunded' : verificationResult.status}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">${verificationResult.totalAmount}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{new Date(verificationResult.orderDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Add Redeem All button */}
                {verificationResult.tickets.some(ticket => !ticket.isUsed) && (
                  <div className="mb-4">
                    <Button
                      onClick={handleRedeemAll}
                      disabled={isRedeeming}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {isRedeeming ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Ticket className="w-4 h-4 mr-2" />
                      )}
                      Redeem All Tickets
                    </Button>
                  </div>
                )}

                {/* Tickets Section */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Tickets</p>
                  <div className="space-y-4">
                    {verificationResult.tickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900">{ticket.ticketName}</p>
                            <p className="text-sm text-gray-500 mt-1">Code: {ticket.ticketCode}</p>
                            <p className="text-sm text-gray-500">Quantity: {ticket.quantity}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              ticket.isUsed 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {ticket.isUsed ? 'Used' : 'Valid'}
                            </span>
                            {!ticket.isUsed && (
                              <Button
                                size="sm"
                                onClick={() => handleRedeem(ticket.id)}
                                disabled={isRedeeming}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                {isRedeeming ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <Ticket className="w-3 h-3 mr-1.5" />
                                    Redeem
                                  </>
                                )}
                              </Button>
                            )}
                            {ticket.isUsed && (
                              <p className="text-xs text-gray-500">
                                Used: {new Date(ticket.usedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                {verificationResult.message && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="font-medium">{verificationResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
