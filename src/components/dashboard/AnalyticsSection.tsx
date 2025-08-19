import React, { useState } from 'react';
import { TrendingUp, Eye, Star, DollarSign, Users, MapPin, Download, Calendar, BarChart3 } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
}

export const AnalyticsSection: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Key metrics data
  const keyMetrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '₹1,24,500',
      change: 15,
      changeType: 'increase',
      icon: <DollarSign size={24} />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Bookings',
      value: 89,
      change: 22,
      changeType: 'increase',
      icon: <Users size={24} />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Profile Views',
      value: '2,147',
      change: 8,
      changeType: 'increase',
      icon: <Eye size={24} />,
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Avg. Rating',
      value: 4.8,
      change: 0.3,
      changeType: 'increase',
      icon: <Star size={24} />,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  // Sample chart data for revenue over time
  const revenueData: ChartData[] = [
    { name: 'Jan', value: 85000 },
    { name: 'Feb', value: 92000 },
    { name: 'Mar', value: 78000 },
    { name: 'Apr', value: 108000 },
    { name: 'May', value: 95000 },
    { name: 'Jun', value: 124500 }
  ];

  // Sample chart data for bookings by event type
  const eventTypeData: ChartData[] = [
    { name: 'Adventure Tours', value: 35 },
    { name: 'Cultural Events', value: 22 },
    { name: 'Workshop & Classes', value: 18 },
    { name: 'Food & Dining', value: 14 }
  ];

  // Sample chart data for monthly bookings
  const monthlyBookingsData: ChartData[] = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 18 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 24 },
    { name: 'May', value: 20 },
    { name: 'Jun', value: 28 }
  ];

  const getMaxValue = (data: ChartData[]) => Math.max(...data.map(d => d.value));

  const SimpleBarChart: React.FC<{ data: ChartData[]; color: string; title: string; valuePrefix?: string }> = ({ data, color, title, valuePrefix = '' }) => {
    const maxValue = getMaxValue(data);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-brand-dark-900">{title}</h3>
          <BarChart3 size={20} className="text-brand-dark-400" />
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-brand-dark-700">{item.name}</span>
                <span className="text-sm font-bold text-brand-dark-900">{valuePrefix}{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart: React.FC<{ data: ChartData[]; title: string; valuePrefix?: string }> = ({ data, title, valuePrefix = '' }) => {
    const maxValue = getMaxValue(data);
    const chartHeight = 200;
    const padding = 40;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-brand-dark-900">{title}</h3>
          <TrendingUp size={20} className="text-brand-green-600" />
        </div>
        <div className="relative" style={{ height: chartHeight }}>
          <svg width="100%" height={chartHeight} className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={index}
                x1="0"
                y1={chartHeight - padding - ratio * (chartHeight - padding * 2)}
                x2="100%"
                y2={chartHeight - padding - ratio * (chartHeight - padding * 2)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            
            {/* Area under line */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <path
              fill="url(#areaGradient)"
              d={`M 0 ${chartHeight - padding} 
                  ${data.map((item, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = chartHeight - padding - ((item.value / maxValue) * (chartHeight - padding * 2));
                    return `L ${x}% ${y}`;
                  }).join(' ')}
                  L 100% ${chartHeight - padding} Z`}
            />
            
            {/* Line chart */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = chartHeight - padding - ((item.value / maxValue) * (chartHeight - padding * 2));
                return `${x}%,${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = chartHeight - padding - ((item.value / maxValue) * (chartHeight - padding * 2));
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    className="hover:r-6 transition-all duration-200"
                  />
                  <text
                    x={`${x}%`}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-xs fill-brand-dark-600 font-medium"
                  >
                    {valuePrefix}{item.value}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-4">
            {data.map((item, index) => (
              <span key={index} className="text-xs text-brand-dark-500 font-medium">{item.name}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const exportToCSV = () => {
    // Prepare data for CSV export
    const csvData = {
      keyMetrics: keyMetrics.map(metric => ({
        Metric: metric.title,
        Value: metric.value,
        Change: `${metric.change}%`,
        Trend: metric.changeType
      })),
      revenueData: revenueData.map(item => ({
        Month: item.name,
        Revenue: `₹${item.value}`
      })),
      eventTypeData: eventTypeData.map(item => ({
        'Event Type': item.name,
        Bookings: item.value
      })),
      monthlyBookingsData: monthlyBookingsData.map(item => ({
        Month: item.name,
        Bookings: item.value
      })),
      topEvents: [
        { Event: 'Himalayan Trek Adventure', Bookings: 24, Revenue: '₹48,000' },
        { Event: 'Goa Beach Festival', Bookings: 18, Revenue: '₹36,000' },
        { Event: 'Rajasthan Cultural Tour', Bookings: 15, Revenue: '₹30,000' }
      ],
      customerInsights: [
        { Segment: 'Repeat Customers', Percentage: '65%' },
        { Segment: 'Group Bookings', Percentage: '45%' },
        { Segment: 'Solo Travelers', Percentage: '30%' }
      ]
    };

    // Convert to CSV format
    const convertToCSV = (objArray: any[], title: string) => {
      if (objArray.length === 0) return '';
      
      const headers = Object.keys(objArray[0]);
      const csvContent = [
        `\n${title.toUpperCase()}`,
        headers.join(','),
        ...objArray.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');
      
      return csvContent;
    };

    // Combine all data
    const fullCSV = [
      `Analytics Dashboard Export - ${new Date().toLocaleDateString()}`,
      `Time Period: ${timeRange}`,
      '',
      convertToCSV(csvData.keyMetrics, 'Key Metrics'),
      convertToCSV(csvData.revenueData, 'Revenue Data'),
      convertToCSV(csvData.eventTypeData, 'Event Type Distribution'),
      convertToCSV(csvData.monthlyBookingsData, 'Monthly Bookings'),
      convertToCSV(csvData.topEvents, 'Top Performing Events'),
      convertToCSV(csvData.customerInsights, 'Customer Insights'),
      '',
      'Note: This is sample data for demonstration purposes.',
      'Actual data will be available after one month of platform usage.'
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([fullCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Sample Data Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">ℹ</span>
          </div>
          <div>
            <h3 className="text-blue-900 font-semibold mb-1">Sample Analytics Dashboard</h3>
            <p className="text-blue-700 text-sm">
              This is a sample dashboard showing what your analytics will look like. Real data will be populated here after one month of platform usage. You can export this sample data using the export button to see the format.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark-900">Analytics Dashboard</h2>
          <p className="text-brand-dark-500">Track your event business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={14} className={metric.changeType === 'decrease' ? 'rotate-180' : ''} />
                <span>+{metric.change}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{metric.value}</h3>
            <p className="text-brand-dark-500 text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <LineChart data={revenueData} title="Revenue Trend" valuePrefix="₹" />
        </div>
        
        {/* Event Types Chart */}
        <SimpleBarChart 
          data={eventTypeData} 
          color="from-blue-500 to-cyan-600" 
          title="Bookings by Event Type" 
        />
        
        {/* Monthly Bookings Chart */}
        <SimpleBarChart 
          data={monthlyBookingsData} 
          color="from-green-500 to-emerald-600" 
          title="Monthly Bookings" 
        />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-dark-900">Top Performing Events</h3>
            <Star className="text-yellow-500" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { name: 'Himalayan Trek Adventure', bookings: 24, revenue: '₹48,000' },
              { name: 'Goa Beach Festival', bookings: 18, revenue: '₹36,000' },
              { name: 'Rajasthan Cultural Tour', bookings: 15, revenue: '₹30,000' }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-brand-dark-900 text-sm">{event.name}</p>
                  <p className="text-xs text-brand-dark-500">{event.bookings} bookings</p>
                </div>
                <span className="font-bold text-brand-green-600 text-sm">{event.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-dark-900">Customer Insights</h3>
            <Users className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-brand-dark-600">Repeat Customers</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" style={{width: '65%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-brand-dark-600">Group Bookings</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-brand-dark-600">Solo Travelers</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600" style={{width: '30%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-dark-900">Recent Activity</h3>
            <Calendar className="text-purple-500" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { action: 'New booking received', time: '2 hours ago', icon: <Users size={16} className="text-blue-600" /> },
              { action: 'Profile viewed 25 times', time: '4 hours ago', icon: <Eye size={16} className="text-green-600" /> },
              { action: '5-star review received', time: '1 day ago', icon: <Star size={16} className="text-yellow-600" /> },
              { action: 'Event photos updated', time: '2 days ago', icon: <MapPin size={16} className="text-purple-600" /> }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-dark-900">{activity.action}</p>
                  <p className="text-xs text-brand-dark-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};