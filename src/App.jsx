import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import ConnectWallet from './pages/ConnectWallet';
import Home from './pages/Home';
import KYC from './pages/KYC';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <WalletProvider>
        <Routes>
          <Route path="/" element={<ConnectWallet />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WalletProvider>
    </Router>
  );
}

export default App;
