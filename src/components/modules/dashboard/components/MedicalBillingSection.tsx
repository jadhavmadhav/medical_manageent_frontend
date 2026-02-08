'use client';
 
import { FileText, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import Card from './Card';
 

const MedicalBillingSection = () => {
  const pendingClaims = [
    { id: '5214', patient: 'John Smith', amount: '$1,250', status: 'High', days: 2 },
    { id: '5215', patient: 'Maria Garcia', amount: '$850', status: 'Medium', days: 1 },
    { id: '5216', patient: 'Robert Johnson', amount: '$420', status: 'Low', days: 3 },
  ];

  const claimsStatus = [
    { status: 'Approved', percentage: 65, count: 42, color: 'bg-green-500' },
    { status: 'Pending', percentage: 20, count: 13, color: 'bg-blue-500' },
    { status: 'Denied', percentage: 10, count: 6, color: 'bg-red-500' },
    { status: 'Rejected', percentage: 5, count: 3, color: 'bg-yellow-500' },
  ];

  return (
    <Card title="Medical Billing">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-700">18</p>
                <p className="text-sm text-blue-600">Pending Claims</p>
              </div>
              <FileText className="text-blue-500" size={20} />
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-700">$12,540</p>
                <p className="text-sm text-green-600">This Month</p>
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-700">94%</p>
                <p className="text-sm text-purple-600">Approval Rate</p>
              </div>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-700">2.3</p>
                <p className="text-sm text-orange-600">Avg Days</p>
              </div>
              <Clock className="text-orange-500" size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Claims */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <AlertCircle size={16} className="mr-2 text-red-500" />
              Priority Claims
            </h3>
            
            <div className="space-y-3">
              {pendingClaims.map((claim) => (
                <div key={claim.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">#{claim.id}</span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          claim.status === 'High' ? 'bg-red-100 text-red-800' :
                          claim.status === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{claim.patient}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{claim.amount}</p>
                      <p className="text-xs text-gray-500">{claim.days} day(s) ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50">
              View All Claims →
            </button>
          </div>

          {/* Claims Status */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Claims Status</h3>
            
            <div className="space-y-4">
              {claimsStatus.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">{item.status}</span>
                    <span className="text-sm text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">{item.count} claims</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Claims Processed</p>
                  <p className="text-2xl font-bold text-gray-900">64</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">+12%</p>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MedicalBillingSection;