import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

const Card = ({ title, icon: Icon, children, className = '', action }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {Icon && <Icon size={20} className="text-blue-600 mr-2" />}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;