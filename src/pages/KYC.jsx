import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const KYC = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>KYC Process</h1>
          <p style={{ color: '#666' }}>Complete your identity verification</p>
        </div>

        {/* KYC Content */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '40px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
            KYC Integration - Coming Soon
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            This section will integrate with Sumsub WebSDK for:
          </p>

          <div
            style={{
              textAlign: 'left',
              maxWidth: '500px',
              margin: '0 auto 30px',
            }}
          >
            <ul style={{ lineHeight: '2' }}>
              <li>📄 Document verification (ID, Passport, Driver's License)</li>
              <li>👤 Proof of Life (Facial verification)</li>
              <li>✓ OFAC sanctions list screening</li>
              <li>✓ USDC blacklist verification</li>
              <li>🔒 Zero-Knowledge proof generation</li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: '#e3f2fd',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
            }}
          >
            <p style={{ fontSize: '14px', color: '#1976d2', margin: 0 }}>
              <strong>Your Wallet:</strong> {publicKey}
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#fff3e0',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
            }}
          >
            <p style={{ fontSize: '14px', color: '#e65100', margin: 0 }}>
              ⚠️ <strong>TODO:</strong> Integrate Sumsub WebSDK, OFAC API, and ZK proof generation
            </p>
          </div>

          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '15px 40px',
              fontSize: '16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYC;
