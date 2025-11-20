import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const Home = () => {
  const { publicKey, disconnectWallet } = useWallet();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  const handleCompleteKYC = () => {
    navigate('/kyc');
  };

  // Formatear la dirección para mostrar solo primeros y últimos caracteres
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto 40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ fontSize: '32px', margin: 0, color: '#333' }}>InZpeKtor</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#e3f2fd',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#1976d2',
              fontWeight: 'bold',
            }}
          >
            {formatAddress(publicKey)}
          </div>
          <button
            onClick={handleDisconnect}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Welcome Card */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '30px',
          }}
        >
          <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
            Welcome to InZpeKtor Dashboard
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Your wallet is connected. Complete your KYC to unlock all functionalities.
          </p>

          {/* KYC Call to Action */}
          <div
            style={{
              backgroundColor: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: '10px',
              padding: '30px',
              marginBottom: '30px',
            }}
          >
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#e65100' }}>
              🔒 Complete KYC to have all functionalities
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Complete the KYC process to access the full ZK Clean Hands Verification system
            </p>
            <button
              onClick={handleCompleteKYC}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f57c00';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ff9800';
              }}
            >
              Start KYC Process
            </button>
          </div>

          {/* Info Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '30px',
            }}
          >
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>🔐 KYC Verification</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Complete identity verification with proof of life
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>✓ OFAC Screening</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Automatic verification against sanctions lists
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>🔒 ZK Proof</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Generate zero-knowledge proof attestation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
