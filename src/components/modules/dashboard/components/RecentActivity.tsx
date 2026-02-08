'use client';

import { CheckCircle, XCircle, Package, User, FileText, AlertCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'claim',
      action: 'approved',
      title: 'Claim #5213 approved',
      description: 'Insurance payment processed',
      amount: '$425',
      time: '10:25 AM',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'inventory',
      action: 'received',
      title: 'Inventory received',
      description: 'Surgical gloves (500 units)',
      amount: '',
      time: '09:45 AM',
      color: 'bg-blue-100 text-blue-800',
      icon: Package
    },
    {
      id: 3,
      type: 'patient',
      action: 'check-in',
      title: 'Patient check-in',
      description: 'John Smith (Appt #103)',
      amount: '',
      time: '09:15 AM',
      color: 'bg-purple-100 text-purple-800',
      icon: User
    },
    {
      id: 4,
      type: 'claim',
      action: 'submitted',
      title: 'Claims submitted',
      description: '3 claims to Medicare',
      amount: '',
      time: 'Yesterday',
      color: 'bg-yellow-100 text-yellow-800',
      icon: FileText
    },
    {
      id: 5,
      type: 'alert',
      action: 'denied',
      title: 'Claim denied',
      description: 'Requires coding review',
      amount: '',
      time: 'Yesterday',
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    },
  ];

  return (
    <div className=" rounded-xl shadow-sm border  p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All →
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="pb-4 border-b  last:border-0 last:pb-0">
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${activity.color} mr-3`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-muted-foreground truncate">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground ml-2">{activity.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  {activity.amount && (
                    <p className="text-sm font-medium text-muted-foreground mt-1">{activity.amount}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* System Notifications */}
      <div className="mt-6 pt-6 border-t ">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-muted-foreground flex items-center">
            <AlertCircle size={16} className="mr-2 text-yellow-500" />
            System Notifications
          </h3>
          <span className="text-xs text-muted-foreground">2 new</span>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">System Maintenance</p>
            <p className="text-xs text-yellow-600 mt-1">
              Scheduled for Sunday, 2:00 AM - 4:00 AM
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Update Available</p>
            <p className="text-xs text-blue-600 mt-1">
              Version 2.3.1 ready to install
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;