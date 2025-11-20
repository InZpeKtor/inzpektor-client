import { Navigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const ProtectedRoute = ({ children }) => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
