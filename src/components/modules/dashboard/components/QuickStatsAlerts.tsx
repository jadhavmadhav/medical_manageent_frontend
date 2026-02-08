'use client';

import { AlertTriangle, Calendar, DollarSign, Package, TrendingUp, Clock, Users, Activity } from 'lucide-react';
import StatCard from './StatCard';
// import StatCard from '../ui/StatCard';

const QuickStatsAlerts = () => {
  const alerts = [
    { 
      id: 1, 
      type: 'error' as const, 
      message: 'Claim #4521 requires coding review', 
      time: '2h ago',
      priority: 'high'
    },
    { 
      id: 2, 
      type: 'warning' as const, 
      message: 'Insulin stock below minimum (12 units)', 
      time: '4h ago',
      priority: 'high'
    },
    { 
      id: 3, 
      type: 'error' as const, 
      message: '2 claims denied - requires resubmission', 
      time: '1d ago',
      priority: 'medium'
    },
    { 
      id: 4, 
      type: 'info' as const, 
      message: 'Monthly inventory audit due in 3 days', 
      time: '2d ago',
      priority: 'low'
    },
  ];

  const todaysStats = [
    { 
      label: 'Appointments', 
      value: '24', 
      icon: Calendar, 
      change: '+12%', 
      color: 'blue' as const,
      trend: 'up'
    },
    { 
      label: 'Revenue', 
      value: '$8,450', 
      icon: DollarSign, 
      change: '+8%', 
      color: 'green' as const,
      trend: 'up'
    },
    { 
      label: 'Claims Submitted', 
      value: '18', 
      icon: TrendingUp, 
      change: '+5%', 
      color: 'purple' as const,
      trend: 'up'
    },
    { 
      label: 'Inventory Orders', 
      value: '3', 
      icon: Package, 
      change: '-2%', 
      color: 'orange' as const,
      trend: 'down'
    },
  ];

  const systemMetrics = [
    { label: 'Active Patients', value: '342', icon: Users, color: 'blue' as const },
    { label: 'Avg Wait Time', value: '12 min', icon: Clock, color: 'green' as const },
    { label: 'System Uptime', value: '99.8%', icon: Activity, color: 'purple' as const },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-200 text-red-800';
      case 'medium': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'low': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="rounded-xl shadow-sm border p-5">
      {/* Alerts Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-500" size={20} />
            System Alerts ({alerts.length})
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Last 24h</span>
        </div>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-3 border rounded-lg flex items-start ${getPriorityColor(alert.priority)}`}
            >
              <div className={`flex-shrink-0 mt-0.5 ${getIconColor(alert.type)}`}>
                <AlertTriangle size={16} />
              </div>
              <div className="flex-1 ml-3 min-w-0">
                <p className="text-sm font-medium">{alert.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-75">{alert.time}</span>
                  <button className="text-xs font-medium hover:underline">
                    Take action
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors">
          View All Alerts →
        </button>
      </div>

      {/* Today's Stats */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          {todaysStats.map((stat, index) => (
            <div key={index} className="relative">
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                color={stat.color}
              />
              {stat.trend === 'up' ? (
                <div className="absolute top-2 right-2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-500"></div>
              ) : (
                <div className="absolute top-2 right-2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">System Metrics</h3>
        <div className="space-y-3">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    metric.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{metric.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">Daily Target</p>
            <p className="text-2xl font-bold text-blue-700">78%</p>
            <p className="text-xs text-blue-600 mt-1">18/23 tasks completed</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#3b82f6"
                strokeWidth="4"
                fill="none"
                strokeDasharray="175.929"
                strokeDashoffset="38.705"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-700">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsAlerts;