import { createContext, useState, useContext, ReactNode } from 'react';

const WalletContext = createContext<{
  wallet: { publicKey: string; privateKey: string };
  setWallet: React.Dispatch<React.SetStateAction<{ publicKey: string; privateKey: string }>>;
}>({ wallet: { publicKey: '', privateKey: '' }, setWallet: () => {} });

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<{ publicKey: string; privateKey: string }>({ publicKey: '', privateKey: '' });

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
