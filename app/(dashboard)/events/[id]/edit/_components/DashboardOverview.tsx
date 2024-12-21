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
  ShieldCheck
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  ticketsSold: number;
  totalViews: number;
  revenue: number;
}

interface DashboardOverviewProps {
  initialStats?: DashboardStats;
}

export function DashboardOverview({ initialStats }: DashboardOverviewProps) {
  const [stats] = useState<DashboardStats>(initialStats || {
    totalSales: 0,
    ticketsSold: 0,
    totalViews: 0,  
    revenue: 0
  });

  const statsCards = [
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: DollarSign,
      change: 12.5,
      trend: 'up'
    },
    {
      title: 'Tickets Sold',
      value: stats.ticketsSold,
      icon: Ticket,
      change: 8.2,
      trend: 'up'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Users,
      change: -2.4,
      trend: 'down'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue}`,
      icon: TrendingUp,
      change: 15.3,
      trend: 'up'
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleVerifyEvent}
            className="bg-green-600 hover:bg-green-700 text-white"
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
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card key={stat.title} className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primaryColor" />
                </div>
                <div className={`flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">View All</Button>
        </div>
        <div className="space-y-3 sm:space-y-4">
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
      </Card>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50">
      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 mt-2 rounded-full bg-primaryColor" />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{description}</p>
      </div>
      <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
} 