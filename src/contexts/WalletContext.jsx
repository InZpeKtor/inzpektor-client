import { createContext, useContext, useState, useEffect } from 'react';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';

const WalletContext = createContext(undefined);

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize Stellar Wallets Kit once on mount
    if (!initialized) {
      try {
        StellarWalletsKit.init({ modules: defaultModules() });
        setInitialized(true);
        console.log('Stellar Wallets Kit initialized');
      } catch (error) {
        console.error('Error initializing Stellar Wallets Kit:', error);
      }
    }
  }, [initialized]);

  const connectWallet = async () => {
    if (!initialized) {
      alert('Wallet kit is still initializing. Please wait a moment and try again.');
      return;
    }

    try {
      console.log('Attempting to connect wallet...');
      
      // Get the address from the selected wallet
      const { address } = await StellarWalletsKit.getAddress();
      
      setPublicKey(address);
      setConnected(true);
      console.log('Wallet connected:', address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting to wallet. Please make sure you have a Stellar wallet installed (Freighter, Albedo, xBull, etc.) and try again.');
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setConnected(false);
    console.log('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: connected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
