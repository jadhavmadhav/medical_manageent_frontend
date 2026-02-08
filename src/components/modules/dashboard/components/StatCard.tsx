import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatCard = ({ label, value, icon: Icon, change, color }: StatCardProps) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  };

  return (
    <div className={`p-4 border rounded-lg ${colorClasses[color].border} ${colorClasses[color].bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-white ${colorClasses[color].text}`}>
          <Icon size={18} />
        </div>
        {change && (
          <span className={`text-xs font-medium ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

export default StatCard;