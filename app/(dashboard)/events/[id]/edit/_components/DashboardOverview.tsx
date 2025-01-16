'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Ticket, 
  DollarSign, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  ShieldCheck,
  BanknoteIcon,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getDashboardOrders } from '@/lib/actions/events';
import { toast } from 'sonner';

interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  ticketSold: number;
  totalViews: number;
  recentWithdraw: [];
}

interface DashboardOverviewProps {
  eventId: string;
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

export function DashboardOverview({ eventId }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        if (!eventId) {
          throw new Error('Event ID is required');
        }
        const response = await getDashboardOrders(eventId);
        setStats(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [eventId]);

  const statsCards = stats ? [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Tickets Sold',
      value: stats.ticketSold,
      icon: Ticket,
      trend: 'up'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Users,
      trend: 'down'
    },
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      trend: 'up'
    }
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
      </div>
    );
  }

  const handleVerifyEvent = () => {
    router.push(`/events/${eventId}/edit/verify`);
  };

  const event = {
    isVerified: false,
    isPublished: false
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500">Monitor your event&apos;s performance and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleVerifyEvent}
            className="bg-green-600 hover:bg-green-700 text-white font-medium"
            disabled={event.isVerified}
          >
            {event.isVerified ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verified
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verify Event
              </>
            )}
          </Button>
          <Button
            onClick={() => router.push('/finance')}
            className="bg-primaryColor hover:bg-indigo-700 text-white font-medium"
          >
            <BanknoteIcon className="h-4 w-4 mr-2" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card 
              key={stat.title} 
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl transition-colors duration-200 hover:bg-indigo-100">
                    <Icon className="w-6 h-6 text-primaryColor" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Latest updates and transactions</p>
            </div>
          </div>
          <div className="space-y-4">
            {stats?.recentWithdraw.length ? (
              stats.recentWithdraw.map((activity, index) => (
                <ActivityItem
                  key={index}
                  title="Withdrawal"
                  description={`Withdrawal processed`}
                  time="Just now"
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-2 h-2 mt-2 rounded-full bg-primaryColor flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1 truncate">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
} 