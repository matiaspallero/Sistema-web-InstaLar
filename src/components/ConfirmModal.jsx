import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) {
  if (!isOpen) return null;

  const tipos = {
    danger: {
      bg: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-600 hover:bg-yellow-700',
      icon: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600'
    }
  };

  const config = tipos[type] || tipos.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${config.icon} text-4xl`}>
              <FaExclamationTriangle />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2 ${config.bg} text-white rounded-lg transition-colors font-medium`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;