'use client';

import { useState } from 'react';
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
  BanknoteIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalSales: number;
  ticketsSold: number;
  totalViews: number;
  revenue: number;
}

interface DashboardOverviewProps {
  initialStats?: DashboardStats;
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

export function DashboardOverview({ initialStats }: DashboardOverviewProps) {
  const [stats] = useState<DashboardStats>(initialStats || {
    totalSales: 0,
    ticketsSold: 0,
    totalViews: 0,  
    revenue: 0
  });

  const router = useRouter();

  const statsCards = [
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: DollarSign,
      change: 12.5,
      trend: 'up',
      description: 'Total sales this month'
    },
    {
      title: 'Tickets Sold',
      value: stats.ticketsSold,
      icon: Ticket,
      change: 8.2,
      trend: 'up',
      description: 'Tickets sold this month'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Users,
      change: -2.4,
      trend: 'down',
      description: 'Page views this month'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      change: 15.3,
      trend: 'up',
      description: 'Revenue this month'
    }
  ];

  const handleVerifyEvent = async () => {
    try {
      // TODO: Implement event verification 
      console.log('Verifying event');
      // Add API call here
    } catch (error) {
      console.error('Error verifying event:', error);
    }
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
            <Card key={stat.title} className="relative overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Icon className="w-5 h-5 text-primaryColor" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
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
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            <ActivityItem
              title="New Order"
              description="John Doe purchased 2 VIP tickets"
              time="5 minutes ago"
            />
            <ActivityItem
              title="Ticket Update"
              description="Early Bird tickets are now sold out"
              time="2 hours ago"
            />
            <ActivityItem
              title="Event View"
              description="Your event was viewed 50 times today"
              time="5 hours ago"
            />
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