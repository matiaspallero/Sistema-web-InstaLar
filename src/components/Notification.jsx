import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

function Notification({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const tipos = {
    success: {
      bg: 'bg-green-500',
      icon: FaCheckCircle,
      text: 'text-green-50'
    },
    error: {
      bg: 'bg-red-500',
      icon: FaExclamationCircle,
      text: 'text-red-50'
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: FaExclamationCircle,
      text: 'text-yellow-50'
    },
    info: {
      bg: 'bg-blue-500',
      icon: FaInfoCircle,
      text: 'text-blue-50'
    }
  };

  const config = tipos[notification.tipo] || tipos.info;
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${config.bg} ${config.text} rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-center gap-3`}>
        <Icon className="text-2xl shrink-0" />
        <p className="flex-1 font-medium">{notification.mensaje}</p>
        <button
          onClick={onClose}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default Notification;