'use client';
 
import { Package, AlertTriangle, Calendar, ShoppingCart, Truck, BarChart, RotateCcw } from 'lucide-react';
 
import { useState } from 'react';
import Card from './Card';

const InventoryManagementSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const lowStockItems = [
    { 
      id: 1, 
      name: 'Insulin Vial', 
      current: 12, 
      minimum: 50, 
      unit: 'units',
      category: 'Medication',
      lastOrdered: '2024-04-15',
      supplier: 'MediCorp'
    },
    { 
      id: 2, 
      name: 'Surgical Masks', 
      current: 200, 
      minimum: 1000, 
      unit: 'boxes',
      category: 'PPE',
      lastOrdered: '2024-04-18',
      supplier: 'SafeMed'
    },
    { 
      id: 3, 
      name: 'Sutures', 
      current: 15, 
      minimum: 100, 
      unit: 'packs',
      category: 'Surgical',
      lastOrdered: '2024-04-10',
      supplier: 'SurgiPro'
    },
    { 
      id: 4, 
      name: 'IV Catheters', 
      current: 45, 
      minimum: 200, 
      unit: 'units',
      category: 'Medical Supplies',
      lastOrdered: '2024-04-12',
      supplier: 'MediFlow'
    },
  ];

  const expiringItems = [
    { 
      id: 1, 
      name: 'Lidocaine 2%', 
      expiry: '2024-05-15', 
      quantity: 25,
      category: 'Medication',
      daysUntil: 15
    },
    { 
      id: 2, 
      name: 'Bandages Sterile', 
      expiry: '2024-05-18', 
      quantity: 120,
      category: 'Wound Care',
      daysUntil: 18
    },
    { 
      id: 3, 
      name: 'Latex Gloves', 
      expiry: '2024-05-22', 
      quantity: 500,
      category: 'PPE',
      daysUntil: 22
    },
    { 
      id: 4, 
      name: 'Alcohol Swabs', 
      expiry: '2024-05-25', 
      quantity: 300,
      category: 'Medical Supplies',
      daysUntil: 25
    },
  ];

  const categories = [
    { id: 'all', name: 'All Items', count: 45 },
    { id: 'medication', name: 'Medication', count: 12 },
    { id: 'ppe', name: 'PPE', count: 8 },
    { id: 'surgical', name: 'Surgical', count: 10 },
    { id: 'supplies', name: 'Supplies', count: 15 },
  ];

  const inventoryStats = [
    { label: 'Total Items', value: '1,245', icon: Package, color: 'blue', change: '+5%' },
    { label: 'Low Stock', value: '8', icon: AlertTriangle, color: 'red', change: '-2%' },
    { label: 'Expiring Soon', value: '12', icon: Calendar, color: 'orange', change: '+3%' },
    { label: 'Pending Orders', value: '5', icon: ShoppingCart, color: 'green', change: '+15%' },
  ];

  const recentOrders = [
    { id: 'ORD-7841', supplier: 'MediCorp', status: 'Delivered', items: 24, date: '2024-04-20' },
    { id: 'ORD-7840', supplier: 'SafeMed', status: 'In Transit', items: 18, date: '2024-04-19' },
    { id: 'ORD-7839', supplier: 'SurgiPro', status: 'Processing', items: 32, date: '2024-04-18' },
    { id: 'ORD-7838', supplier: 'MediFlow', status: 'Delivered', items: 15, date: '2024-04-17' },
  ];

  const getStockPercentage = (current: number, minimum: number) => {
    return (current / minimum) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title="Inventory Management" icon={Package}>
      <div className="space-y-6">
        {/* Inventory Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inventoryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`p-4 rounded-lg border ${
                stat.color === 'blue' ? 'bg-blue-50 border-blue-100' :
                stat.color === 'red' ? 'bg-red-50 border-red-100' :
                stat.color === 'orange' ? 'bg-orange-50 border-orange-100' :
                'bg-green-50 border-green-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    stat.color === 'red' ? 'bg-red-100 text-red-600' :
                    stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className={`text-xs font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <AlertTriangle size={16} className="mr-2 text-red-500" />
                Low Stock Alerts
              </h3>
              <span className="text-xs text-gray-500">Reorder needed</span>
            </div>
            
            <div className="space-y-3">
              {lowStockItems.map((item) => {
                const percentage = getStockPercentage(item.current, item.minimum);
                return (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{item.supplier}</span>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        percentage < 20 ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {item.current}/{item.minimum} {item.unit}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${percentage < 20 ? 'bg-red-500' : 'bg-yellow-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{percentage.toFixed(1)}% of minimum</span>
                        <span>Last ordered: {item.lastOrdered}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <button className="flex-1 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50">
                        Order Now
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50">
              View All Stock Levels →
            </button>
          </div>

          {/* Expiring Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Calendar size={16} className="mr-2 text-orange-500" />
                Expiring Soon
              </h3>
              <span className="text-xs text-gray-500">Next 30 days</span>
            </div>
            
            <div className="space-y-3">
              {expiringItems.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          item.daysUntil < 7 ? 'bg-red-100 text-red-800' :
                          item.daysUntil < 14 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.daysUntil} days
                        </span>
                        <span className="text-xs text-gray-500 ml-2">{item.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.quantity} units</p>
                      <p className="text-xs text-gray-500">Exp: {item.expiry}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <button className="flex-1 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 border border-orange-200 rounded-lg hover:bg-orange-50">
                      Use First
                    </button>
                    <button className="flex-1 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50">
                      Flag for Disposal
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Truck size={16} className="mr-2 text-blue-500" />
                Recent Orders
              </h4>
              
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.supplier}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Order */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Quick Reorder</h4>
                  <p className="text-sm text-blue-700 mt-1">Most frequently ordered items</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  New Order
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {['Gloves', 'Syringes', 'Bandages', 'Masks'].map((item) => (
                  <div key={item} className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-gray-900">{item}</p>
                    <p className="text-xs text-gray-500">Reorder level: 100</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Value Summary */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <BarChart size={16} className="mr-2 text-green-500" />
              Inventory Value Summary
            </h3>
            <span className="text-sm text-gray-500">Total: $124,850</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: 'Medication', value: '$45,200', percentage: 36, color: 'bg-blue-500' },
              { category: 'Surgical', value: '$32,500', percentage: 26, color: 'bg-green-500' },
              { category: 'PPE', value: '$28,150', percentage: 23, color: 'bg-purple-500' },
              { category: 'Supplies', value: '$19,000', percentage: 15, color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.category} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{item.percentage}% of total</span>
                  <span>+3.2%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InventoryManagementSection;