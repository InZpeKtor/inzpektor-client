import { useEffect, useRef } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import './WalletConnect.css';

export default function WalletConnect() {
  const { publicKey, isConnected, disconnectWallet, connectWallet, initialized } = useWallet();
  const buttonWrapperRef = useRef(null);
  const buttonCreated = useRef(false);
  const checkingConnection = useRef(false);

  useEffect(() => {
    // Create the wallet button only once and only when initialized
    if (buttonWrapperRef.current && !isConnected && !buttonCreated.current && initialized) {
      console.log('Creating wallet button...');
      console.log('Wrapper element:', buttonWrapperRef.current);
      buttonWrapperRef.current.innerHTML = '';
      
      try {
        StellarWalletsKit.createButton(buttonWrapperRef.current);
        buttonCreated.current = true;
        console.log('Wallet button created');
        
        // Check if button was actually added and add click listener
        setTimeout(() => {
          console.log('Wrapper HTML:', buttonWrapperRef.current?.innerHTML);
          console.log('Wrapper children:', buttonWrapperRef.current?.children);
          
          // Add click listener to detect when user clicks and attempt connection
          const button = buttonWrapperRef.current?.querySelector('button');
          if (button) {
            button.addEventListener('click', async () => {
              console.log('🖱️ User clicked Connect Wallet button!');
              
              // Wait a bit for the wallet modal to process and then check for connection
              if (!checkingConnection.current) {
                checkingConnection.current = true;
                
                // Wait 1 second before starting to poll (give time for modal to open)
                setTimeout(() => {
                  // Poll for connection every 1 second for up to 60 seconds
                  let attempts = 0;
                  const maxAttempts = 60;
                  
                  const checkInterval = setInterval(async () => {
                    attempts++;
                    console.log(`🔍 Checking for connection (attempt ${attempts})...`);
                    try {
                      await connectWallet();
                      console.log('✅ Wallet connected successfully!');
                      clearInterval(checkInterval);
                      checkingConnection.current = false;
                    } catch (error) {
                      // Not connected yet
                      if (attempts >= maxAttempts) {
                        console.log('⏱️ Connection check timeout');
                        clearInterval(checkInterval);
                        checkingConnection.current = false;
                      }
                    }
                  }, 1000);
                }, 1000);
              }
            });
          }
        }, 100);
      } catch (error) {
        console.error('Error creating button:', error);
      }
    }
  }, [isConnected, connectWallet, initialized]);

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {isConnected && publicKey ? (
        <div className="wallet-connected">
          <span className="wallet-address">🔗 {formatAddress(publicKey)}</span>
          <button onClick={disconnectWallet} className="btn-disconnect">
            Disconnect
          </button>
        </div>
      ) : !initialized ? (
        <div style={{ padding: '15px 30px', color: '#666' }}>
          Initializing wallet kit...
        </div>
      ) : (
        <div ref={buttonWrapperRef} className="wallet-button-wrapper"></div>
      )}
    </div>
  );
}
