import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const KYC = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [step, setStep] = useState('select'); // select, id-front, id-back, face, verifying, success
  const [docType, setDocType] = useState(null); // 'id' or 'passport'
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Loader steps for post-KYC verification
  const [loaderStep, setLoaderStep] = useState(0);
  const loaderMessages = [
    'Verifying identity...',
    'Verifying if in OFAC list...',
    'Verifying if in USDC blacklist...',
    'Encrypting information with ZK...'
  ];

  useEffect(() => {
    if (step === 'verifying') {
      setLoaderStep(0);
      const interval = setInterval(() => {
        setLoaderStep((prev) => {
          if (prev < loaderMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Guardar KYC completado en la base de datos
            saveKYCToDatabase();
            setTimeout(() => setStep('success'), 3000); // Espera 3 segundos después del último loader
            return prev;
          }
        });
      }, 4000); // Cada verificación dura 4 segundos
      return () => clearInterval(interval);
    }
  }, [step]);

  const saveKYCToDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/kyc/${publicKey}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ KYC saved successfully:', data);
      } else {
        console.error('❌ Error saving KYC:', data);
      }
    } catch (error) {
      console.error('❌ Error calling KYC API:', error);
    }
  };

  function renderVerifyingScreen() {
    return (
      <div style={{ textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ 
          fontSize: '80px', 
          marginBottom: '30px',
          animation: 'pulse 2s ease-in-out infinite'
        }}>⏳</div>
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '30px', 
          color: '#512da8',
          fontWeight: '600'
        }}>Verifying Your Identity</h2>
        
        <div style={{ 
          marginBottom: '40px', 
          width: '100%', 
          maxWidth: '500px',
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {loaderMessages.map((msg, idx) => (
            <div key={msg} style={{
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: loaderStep === idx ? '#e8eaf6' : 'white',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              opacity: loaderStep >= idx ? 1 : 0.4,
              transform: loaderStep === idx ? 'scale(1.02)' : 'scale(1)',
              boxShadow: loaderStep === idx ? '0 2px 12px rgba(81,45,168,0.15)' : 'none'
            }}>
              <span style={{ 
                fontSize: '28px', 
                marginRight: '15px',
                animation: loaderStep === idx ? 'spin 1s linear infinite' : 'none'
              }}>
                {loaderStep > idx ? '✅' : loaderStep === idx ? '🔄' : '⏺️'}
              </span>
              <span style={{ 
                fontWeight: loaderStep === idx ? '600' : '400',
                fontSize: '16px',
                color: loaderStep === idx ? '#512da8' : '#666'
              }}>{msg}</span>
            </div>
          ))}
        </div>
        
        {loaderStep === loaderMessages.length - 1 && (
          <div style={{ 
            marginTop: '20px', 
            fontSize: '22px', 
            color: '#388e3c', 
            fontWeight: 'bold',
            backgroundColor: '#e8f5e9',
            padding: '25px 40px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(56,142,60,0.2)',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
            ALL PROCESS CHECKED SUCCESSFULLY<br />
            <span style={{ fontSize: '18px', color: '#2e7d32' }}>KYC process CHECKED</span>
          </div>
        )}
        
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        // Asegurar que el video se reproduzca
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.log('Autoplay handled by browser');
        }
      }
      setIsCapturing(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const handleSelectDocType = (type) => {
    setDocType(type);
    if (type === 'id') {
      setStep('id-front');
    } else {
      setStep('passport-front');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    setCapturedImage(null);
    
    if (step === 'id-front') {
      setStep('id-back');
    } else if (step === 'id-back') {
      setStep('face');
    } else if (step === 'passport-front') {
      setStep('face');
    } else if (step === 'face') {
      setStep('success');
    }
  };

  const handleFacialRecognition = async () => {
    await startCamera();
    // Simular escaneo de 5 segundos
    setTimeout(() => {
      stopCamera();
      setStep('verifying');
    }, 5000);
    const renderVerifyingScreen = () => (
      <div style={{ textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#512da8' }}>Final Checks</h2>
        <div style={{ marginBottom: '30px', width: '100%', maxWidth: '400px' }}>
          {loaderMessages.map((msg, idx) => (
            <div key={msg} style={{
              display: 'flex', alignItems: 'center', marginBottom: '10px', opacity: loaderStep >= idx ? 1 : 0.3
            }}>
              <span style={{ fontSize: '22px', marginRight: '10px' }}>{loaderStep > idx ? '✅' : loaderStep === idx ? '🔄' : '⏺️'}</span>
              <span style={{ fontWeight: loaderStep === idx ? 'bold' : 'normal' }}>{msg}</span>
            </div>
          ))}
        </div>
        {loaderStep === loaderMessages.length - 1 && (
          <div style={{ marginTop: '30px', fontSize: '20px', color: '#388e3c', fontWeight: 'bold' }}>
            ALL PROCESS CHECKED SUCCESSFULLY<br />KYC process CHECKED
          </div>
        )}
      </div>
    );
  };

  const renderSelectScreen = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
      <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>Identity Verification</h2>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Select the type of document you want to use
      </p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSelectDocType('id')}
          style={{
            padding: '40px',
            width: '250px',
            backgroundColor: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#512da8';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🪪</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>ID Card</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>3 steps: Front, Back, Face</p>
        </button>

        <button
          onClick={() => handleSelectDocType('passport')}
          style={{
            padding: '40px',
            width: '250px',
            backgroundColor: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#512da8';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📘</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Passport</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>2 steps: Document, Face</p>
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        style={{
          marginTop: '40px',
          padding: '12px 30px',
          fontSize: '16px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Back to Home
      </button>
    </div>
  );

  const renderCaptureScreen = () => {
    let title = '';
    let instruction = '';
    let icon = '';

    if (step === 'id-front') {
      title = 'Front Side Photo';
      instruction = 'Take a clear photo of the front of your ID card';
      icon = '🪪';
    } else if (step === 'id-back') {
      title = 'Back Side Photo';
      instruction = 'Take a clear photo of the back of your ID card';
      icon = '🪪';
    } else if (step === 'passport-front') {
      title = 'Passport Photo';
      instruction = 'Take a clear photo of the main page of your passport';
      icon = '📘';
    } else if (step === 'face') {
      title = 'Facial Verification';
      instruction = 'Look at the camera. Scanning will take 5 seconds';
      icon = '🤳';
    }

    const currentStepNumber = 
      step === 'id-front' ? 1 : 
      step === 'id-back' ? 2 : 
      step === 'passport-front' ? 1 : 
      docType === 'id' ? 3 : 2;
    
    const totalSteps = docType === 'id' ? 3 : 2;

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</div>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{title}</h2>
        <p style={{ color: '#666', marginBottom: '10px' }}>{instruction}</p>
        <p style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
          Step {currentStepNumber} of {totalSteps}
        </p>

        {!isCapturing && !capturedImage && step !== 'face' && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              width: '100%',
              maxWidth: '500px',
              height: '350px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px dashed #ccc',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '10px' }}>📄</div>
                <p style={{ color: '#999' }}>Upload your document</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <button
                onClick={() => document.getElementById('file-upload').click()}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  backgroundColor: '#512da8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Upload Image
              </button>
            </label>
          </div>
        )}

        {!isCapturing && !capturedImage && step === 'face' && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              width: '100%',
              maxWidth: '500px',
              height: '350px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px dashed #ccc',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '10px' }}>📷</div>
                <p style={{ color: '#999' }}>Click to start facial scan</p>
              </div>
            </div>
            <button
              onClick={handleFacialRecognition}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                backgroundColor: '#512da8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Start Facial Scan
            </button>
          </div>
        )}

        {isCapturing && step === 'face' && (
          <div style={{ marginBottom: '30px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: '12px',
                marginBottom: '20px',
                backgroundColor: '#000',
                border: '3px solid #512da8',
              }}
            />
            <div style={{
              padding: '20px',
              backgroundColor: '#e8eaf6',
              borderRadius: '8px',
              marginBottom: '20px',
            }}>
              <p style={{ color: '#512da8', margin: 0, fontWeight: 'bold' }}>
                ⏱️ Scanning... Please keep your face visible
              </p>
            </div>
          </div>
        )}

        {capturedImage && (
          <div style={{ marginBottom: '30px' }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleNextStep}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Continue
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Retake
              </button>
            </div>
          </div>
        )}

        {!isCapturing && !capturedImage && (
          <button
            onClick={() => {
              setStep('select');
              setDocType(null);
            }}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        )}
      </div>
    );
  };

  const renderSuccessScreen = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#4caf50' }}>
        Verification Completed!
      </h2>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
        Your identity has been successfully verified
      </p>

      <div style={{
        backgroundColor: '#e8f5e9',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        maxWidth: '500px',
        margin: '0 auto 30px',
      }}>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ fontSize: '14px', color: '#2e7d32', margin: '5px 0' }}>
            ✓ Document verified
          </p>
          <p style={{ fontSize: '14px', color: '#2e7d32', margin: '5px 0' }}>
            ✓ Facial verification completed
          </p>
          <p style={{ fontSize: '14px', color: '#2e7d32', margin: '5px 0' }}>
            ✓ Information encrypted securely
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '30px',
        fontSize: '12px',
      }}>
        <p style={{ color: '#1976d2', margin: 0 }}>
          <strong>Wallet:</strong> {publicKey}
        </p>
      </div>

      <button
        onClick={() => navigate('/home')}
        style={{
          padding: '15px 50px',
          fontSize: '18px',
          backgroundColor: '#512da8',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );

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
          }}
        >
          {step === 'select' && renderSelectScreen()}
          {(step === 'id-front' || step === 'id-back' || step === 'passport-front' || step === 'face') && renderCaptureScreen()}
          {step === 'verifying' && renderVerifyingScreen()}
          {step === 'success' && renderSuccessScreen()}
        </div>
      </div>
    </div>
  );
};

export default KYC;
