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
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  ticketsSold: number;
  totalViews: number;
  revenue: number;
}

interface DashboardOverviewProps {
  eventId: string;
  initialStats?: DashboardStats;
}

export function DashboardOverview({ eventId, initialStats }: DashboardOverviewProps) {
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Icon className="w-5 h-5 text-primaryColor" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
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
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50">
      <div className="w-2 h-2 mt-2 rounded-full bg-primaryColor" />
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
} 