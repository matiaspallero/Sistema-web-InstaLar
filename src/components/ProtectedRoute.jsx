import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especificaron roles permitidos, verificar
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Tu rol actual: <strong>{user?.rol}</strong>
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
}

export default ProtectedRoute;
