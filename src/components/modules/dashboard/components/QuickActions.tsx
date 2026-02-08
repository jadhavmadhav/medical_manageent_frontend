'use client';

import { Plus, Calendar, ShoppingCart, FileText, UserPlus, BarChart, Download, Upload } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { 
      id: 1, 
      title: 'New Claim', 
      icon: Plus, 
      description: 'Create insurance claim',
      color: 'bg-blue-100 text-blue-600',
      action: () => console.log('New Claim')
    },
    { 
      id: 2, 
      title: 'Schedule Follow-up', 
      icon: Calendar, 
      description: 'Book appointment',
      color: 'bg-green-100 text-green-600',
      action: () => console.log('Schedule')
    },
    { 
      id: 3, 
      title: 'Order Supplies', 
      icon: ShoppingCart, 
      description: 'Place inventory order',
      color: 'bg-purple-100 text-purple-600',
      action: () => console.log('Order')
    },
    { 
      id: 4, 
      title: 'Generate Report', 
      icon: BarChart, 
      description: 'Create monthly report',
      color: 'bg-orange-100 text-orange-600',
      action: () => console.log('Report')
    },
    { 
      id: 5, 
      title: 'Add Patient', 
      icon: UserPlus, 
      description: 'Register new patient',
      color: 'bg-pink-100 text-pink-600',
      action: () => console.log('Add Patient')
    },
    { 
      id: 6, 
      title: 'Export Data', 
      icon: Download, 
      description: 'Download reports',
      color: 'bg-indigo-100 text-indigo-600',
      action: () => console.log('Export')
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-gray-600">Frequently used actions</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
          <Upload size={16} className="mr-1" />
          Upload Documents
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200 text-left"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${action.color} mr-3`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Recent Documents */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Recent Documents</h3>
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {[
            { name: 'Monthly_Report_May.pdf', size: '2.4 MB', date: '2 days ago' },
            { name: 'Claims_Summary.xlsx', size: '1.8 MB', date: '3 days ago' },
            { name: 'Inventory_Audit.pdf', size: '3.2 MB', date: '1 week ago' },
            { name: 'Patient_Records.zip', size: '45.2 MB', date: '2 weeks ago' },
          ].map((doc, index) => (
            <div key={index} className="flex-shrink-0 p-3 border border-gray-200 rounded-lg min-w-[200px]">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.size} • {doc.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;