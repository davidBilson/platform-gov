import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  X,
  AlertCircle,
  MessageSquare,
  CreditCard,
  Shield,
  Calendar,
  User,
  Briefcase,
  Eye,
  EyeOff,
  CheckCheck
} from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationToastProps {
  notification: Notification | null;
  onClose: () => void;
  duration?: number;
}

const NotificationIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ElementType> = {
    welcome: User,
    new_rating: AlertCircle,
    new_message: MessageSquare,
    new_application: Briefcase,
    application_viewed: Eye,
    application_active: Briefcase,
    offer_received: CreditCard,
    offer_accepted: Check,
    offer_declined: EyeOff,
    milestone_completed: CheckCheck,
    milestone_approved: Check,
    milestone_disputed: AlertCircle,
    payment: CreditCard,
    system: Shield,
    reminder: Calendar,
    security: Shield
  };

  const Icon = iconMap[type] || Bell;
  return <Icon className="w-5 h-5" />;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    welcome: 'bg-purple-50 text-purple-600 border-purple-200',
    new_rating: 'bg-green-50 text-green-600 border-green-200',
    new_message: 'bg-blue-50 text-blue-600 border-blue-200',
    new_application: 'bg-blue-50 text-blue-600 border-blue-200',
    application_viewed: 'bg-orange-50 text-orange-600 border-orange-200',
    application_active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    offer_received: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    offer_accepted: 'bg-green-50 text-green-600 border-green-200',
    offer_declined: 'bg-red-50 text-red-600 border-red-200',
    milestone_completed: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    milestone_approved: 'bg-green-50 text-green-600 border-green-200',
    milestone_disputed: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    payment: 'bg-green-50 text-green-600 border-green-200',
    system: 'bg-gray-50 text-gray-600 border-gray-200',
    reminder: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    security: 'bg-red-50 text-red-600 border-red-200'
  };
  return colors[type] || 'bg-gray-50 text-gray-600 border-gray-200';
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

const NotificationToast = ({ 
  notification, 
  onClose, 
  duration = 4000 
}: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (notification && !notification.isRead) {
            setIsVisible(true);
            setIsExiting(false);
        
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [notification, duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
        setIsVisible(false);
        onClose();
        }, 300);
    };

  if (!notification || !isVisible) return null;

  return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full">
      <div 
        className={`
          bg-white rounded-xl border shadow-lg transition-all duration-300 ease-out
          ${isExiting 
            ? 'transform translate-y-[-100%] opacity-0' 
            : 'transform translate-y-0 opacity-100'
          }
          ${!notification.isRead 
            ? 'border-blue-200 bg-blue-50/30' 
            : 'border-gray-200'
          }
        `}
        style={{
          animation: isExiting 
            ? 'slideOutUp 0.3s ease-out forwards' 
            : 'slideInDown 0.3s ease-out forwards'
        }}
      >
        <div className="p-2">
          <div className="flex items-start gap-3">
            
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${getTypeColor(notification.type)}`}>
              <NotificationIcon type={notification.type} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-semibold text-deepskyblue ${!notification.isRead ? 'font-bold' : ''}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-deepskyblue rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(notification.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={handleClose}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-gray-100 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-deepskyblue rounded-b-xl"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;