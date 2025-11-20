import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnectComponent from '../components/WalletConnect';

const ConnectWallet = () => {
  const { isConnected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if wallet is connected
    if (isConnected) {
      console.log('Wallet connected! Redirecting to home...');
      navigate('/home');
    }
  }, [isConnected, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px',
        }}
      >
        <h1 style={{ fontSize: '48px', marginBottom: '10px', color: '#333' }}>
          InZpeKtor
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
          ZK Clean Hands Verification
        </p>

        <WalletConnectComponent />

        <p style={{ marginTop: '30px', fontSize: '14px', color: '#999' }}>
          Select your Stellar wallet to continue
        </p>
      </div>
    </div>
  );
};

export default ConnectWallet;
