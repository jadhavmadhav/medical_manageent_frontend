 'use client';

import { TrendingUp, TrendingDown, PieChart, DollarSign, Download, Filter, ShoppingCart, Package, Pill, Activity } from 'lucide-react';
import { useState } from 'react';

const RevenueOverview = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'sales' | 'purchases'>('sales');

  const revenueData = {
    '7d': { 
      sales: '$12,450', 
      purchases: '$8,200',
      profit: '$4,250',
      salesChange: '+15.5%', 
      purchaseChange: '+8.2%',
      profitChange: '+22.3%'
    },
    '30d': { 
      sales: '$45,800', 
      purchases: '$32,500',
      profit: '$13,300',
      salesChange: '+12.8%', 
      purchaseChange: '+10.5%',
      profitChange: '+18.7%'
    },
    '90d': { 
      sales: '$128,400', 
      purchases: '$98,200',
      profit: '$30,200',
      salesChange: '+9.2%', 
      purchaseChange: '+7.8%',
      profitChange: '+12.5%'
    },
  };

  const revenueBreakdown = [
    { 
      category: 'Prescription Drugs', 
      percentage: 45, 
      color: 'bg-blue-500', 
      amount: '$20,610', 
      change: '+8.2%',
      subCategories: ['Antibiotics', 'Chronic Meds', 'Specialty Drugs']
    },
    { 
      category: 'OTC Products', 
      percentage: 25, 
      color: 'bg-green-500', 
      amount: '$11,450', 
      change: '+15.1%',
      subCategories: ['Pain Relief', 'Cold & Flu', 'Vitamins']
    },
    { 
      category: 'Medical Equipment', 
      percentage: 18, 
      color: 'bg-purple-500', 
      amount: '$8,244', 
      change: '+5.3%',
      subCategories: ['Monitoring Devices', 'Mobility Aids', 'First Aid']
    },
    { 
      category: 'Healthcare Supplies', 
      percentage: 12, 
      color: 'bg-orange-500', 
      amount: '$5,496', 
      change: '+12.8%',
      subCategories: ['Bandages', 'PPE', 'Sanitizers']
    },
  ];

  const topSellingProducts = [
    { 
      name: 'Paracetamol 500mg', 
      category: 'OTC - Pain Relief', 
      sales: '$2,850', 
      quantity: 285, 
      margin: '42%',
      trend: 'up'
    },
    { 
      name: 'Amoxicillin 250mg', 
      category: 'Prescription - Antibiotic', 
      sales: '$2,420', 
      quantity: 121, 
      margin: '38%',
      trend: 'up'
    },
    { 
      name: 'Blood Pressure Monitor', 
      category: 'Medical Equipment', 
      sales: '$1,980', 
      quantity: 33, 
      margin: '45%',
      trend: 'up'
    },
    { 
      name: 'Vitamin C 1000mg', 
      category: 'OTC - Vitamins', 
      sales: '$1,750', 
      quantity: 175, 
      margin: '52%',
      trend: 'up'
    },
    { 
      name: 'Surgical Masks (50pk)', 
      category: 'Healthcare Supplies', 
      sales: '$1,520', 
      quantity: 38, 
      margin: '28%',
      trend: 'down'
    },
  ];

  const purchaseData = {
    topSuppliers: [
      { name: 'MediPharma Inc.', amount: '$8,450', items: 24, rating: '4.8' },
      { name: 'HealthCare Supply Co.', amount: '$6,820', items: 18, rating: '4.6' },
      { name: 'Global Medical Distributors', amount: '$5,230', items: 15, rating: '4.5' },
      { name: 'PharmaDirect', amount: '$4,150', items: 22, rating: '4.7' },
    ],
    pendingOrders: [
      { id: 'PO-2341', supplier: 'MediPharma Inc.', amount: '$2,450', eta: '2 days' },
      { id: 'PO-2340', supplier: 'HealthCare Supply Co.', amount: '$1,850', eta: '3 days' },
      { id: 'PO-2339', supplier: 'Global Medical Distributors', amount: '$3,200', eta: '5 days' },
    ]
  };

  const inventoryMetrics = [
    { label: 'Stock Turnover', value: '4.2', change: '+0.3', icon: RotateCw, color: 'green' },
    { label: 'Gross Margin', value: '38.5%', change: '+2.1%', icon: TrendingUp, color: 'blue' },
    { label: 'Average Order Value', value: '$85.20', change: '+$5.30', icon: ShoppingBag, color: 'purple' },
    { label: 'Inventory Days', value: '45', change: '-3', icon: Calendar, color: 'orange' },
  ];

  const dailySalesData = [1200, 1450, 1320, 1680, 1520, 1890, 1750, 1950, 1820, 2100, 1980, 2250];

  return (
    <div className="rounded-xl shadow-sm border  p-6">
      {/* Header with Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold ">Store Revenue & Purchases</h2>
          <p className="text-muted-foreground">Medical store sales and inventory procurement analytics</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-3 md:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 border  rounded-lg p-1">
            <button
              onClick={() => setViewMode('sales')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center ${
                viewMode === 'sales'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-muted-foreground '
              }`}
            >
              <ShoppingCart size={16} className="mr-2" />
              Sales
            </button>
            <button
              onClick={() => setViewMode('purchases')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center ${
                viewMode === 'purchases'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              <Package size={16} className="mr-2" />
              Purchases
            </button>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sales Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              revenueData[timeRange as keyof typeof revenueData].salesChange.startsWith('+')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {revenueData[timeRange as keyof typeof revenueData].salesChange}
              <TrendingUp className="inline ml-1" size={14} />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {revenueData[timeRange as keyof typeof revenueData].sales}
          </p>
          <p className="text-gray-600 mt-1">Sales Revenue</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <ShoppingCart size={14} className="mr-1" />
            {timeRange === '7d' && 'Last 7 days'}
            {timeRange === '30d' && 'Last 30 days'}
            {timeRange === '90d' && 'Last 90 days'}
          </div>
        </div>

        {/* Purchase Cost */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Package className="text-green-600" size={20} />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              revenueData[timeRange as keyof typeof revenueData].purchaseChange.startsWith('+')
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {revenueData[timeRange as keyof typeof revenueData].purchaseChange}
              <TrendingUp className="inline ml-1" size={14} />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {revenueData[timeRange as keyof typeof revenueData].purchases}
          </p>
          <p className="text-gray-600 mt-1">Purchase Cost</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Package size={14} className="mr-1" />
            Inventory procurement
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              revenueData[timeRange as keyof typeof revenueData].profitChange.startsWith('+')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {revenueData[timeRange as keyof typeof revenueData].profitChange}
              <TrendingUp className="inline ml-1" size={14} />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {revenueData[timeRange as keyof typeof revenueData].profit}
          </p>
          <p className="text-gray-600 mt-1">Gross Profit</p>
          <div className="text-sm text-gray-500 mt-2">
            Margin: {timeRange === '7d' ? '34.1%' : timeRange === '30d' ? '29.1%' : '23.5%'}
          </div>
        </div>
      </div>

      {/* Main Content based on View Mode */}
      {viewMode === 'sales' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Breakdown by Category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Sales by Category</h3>
              <span className="text-sm text-gray-500">Revenue distribution</span>
            </div>
            
            <div className="space-y-4">
              {revenueBreakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                      <div>
                        <span className="font-medium text-gray-900">{category.category}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.subCategories.map((sub, idx) => (
                            <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{category.amount}</span>
                      <span className={`ml-2 text-sm font-medium ${
                        category.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {category.change}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600 min-w-[40px]">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-2xl font-bold text-gray-900">285</p>
                <p className="text-sm text-gray-600">Daily Transactions</p>
                <p className="text-xs text-green-600 mt-1">+12.5% from last week</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-2xl font-bold text-gray-900">$85.20</p>
                <p className="text-sm text-gray-600">Avg Transaction Value</p>
                <p className="text-xs text-green-600 mt-1">+$5.30 from last month</p>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
              <span className="text-sm text-gray-500">This month</span>
            </div>
            
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{product.category}</span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          Margin: {product.margin}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.sales}</p>
                    <div className="flex items-center justify-end mt-1">
                      {product.trend === 'up' && (
                        <TrendingUp className="text-green-500 mr-1" size={14} />
                      )}
                      {product.trend === 'down' && (
                        <TrendingDown className="text-red-500 mr-1" size={14} />
                      )}
                      <span className="text-xs text-gray-500">{product.quantity} units</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Daily Sales Trend */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Daily Sales Trend</h4>
                <span className="text-sm text-green-600 font-medium">+8.2% growth</span>
              </div>
              <div className="flex items-end h-24 space-x-1">
                {dailySalesData.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                      style={{ height: `${(value / 2500) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">D{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Purchases View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Suppliers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Top Suppliers</h3>
              <span className="text-sm text-gray-500">This quarter</span>
            </div>
            
            <div className="space-y-4">
              {purchaseData.topSuppliers.map((supplier, index) => (
                <div key={supplier.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-800 font-bold text-lg">
                        {supplier.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{supplier.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{supplier.items} items</span>
                        <span className="ml-2 flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          ⭐ {supplier.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{supplier.amount}</p>
                    <p className="text-xs text-gray-500">Total purchases</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Purchase Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-2xl font-bold text-gray-900">$32,500</p>
                <p className="text-sm text-gray-600">Monthly Purchases</p>
                <p className="text-xs text-green-600 mt-1">+10.5% from last month</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-xs text-green-600 mt-1">+2 new this month</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pending Orders</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Orders →
              </button>
            </div>
            
            <div className="space-y-4">
              {purchaseData.pendingOrders.map((order) => (
                <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.supplier}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      ETA: {order.eta}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{order.amount}</span>
                    <div className="space-x-2">
                      <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50">
                        Track Order
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 border border-green-200 rounded-lg hover:bg-green-50">
                        Receive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Purchase Analytics */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Purchase Analytics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pharmaceuticals</span>
                    <span className="font-medium text-gray-900">65% of purchases</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Medical Equipment</span>
                    <span className="font-medium text-gray-900">22% of purchases</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-green-500" style={{ width: '22%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Supplies & PPE</span>
                    <span className="font-medium text-gray-900">13% of purchases</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-purple-500" style={{ width: '13%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Metrics (Always visible) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Activity className="text-green-600" size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.2</p>
              <p className="text-sm text-gray-600">Stock Turnover</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+0.3 from last quarter</p>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <TrendingUp className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">38.5%</p>
              <p className="text-sm text-gray-600">Gross Margin</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+2.1% from last month</p>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <ShoppingCart className="text-purple-600" size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">$85.20</p>
              <p className="text-sm text-gray-600">Avg Order Value</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+$5.30 from last month</p>
        </div>
        
        <div className="p-4  border  rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <PieChart className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-muted">45</p>
              <p className="text-sm text-gray-600">Inventory Days</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">-3 days optimization</p>
        </div>
      </div>
    </div>
  );
};

// Import missing icons
import { ShoppingBag, Calendar, RotateCw } from 'lucide-react';

export default RevenueOverview;