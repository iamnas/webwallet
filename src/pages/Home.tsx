import { useState } from 'react';
import { generateMnemonic } from 'bip39';
import { CreateWalletButton } from '../components/CreateWalletButton';
import { CreateWalletPopup } from '../components/CreateWalletPopup';
import AddressDisplays from '../components/AddressDisplays';
import { Shield } from 'lucide-react';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>();

  const handleCreateWalletClick = () => {
    try {
      const mnemonic = generateMnemonic();
      setSeedPhrase(mnemonic.split(' '));
      setShowPopup(true);
    } catch (error) {
      console.error('Failed to generate mnemonic:', error);
    }
  };

  const handleConfirmWallet = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
                    flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {!seedPhrase ? (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Shield className="w-16 h-16 text-emerald-400 mx-auto" />
              <h1 className="text-4xl font-bold text-white">
                Create Your Secure Wallet
              </h1>
              <p className="text-slate-400 max-w-md mx-auto">
                Generate a new wallet with a secure seed phrase. Your keys, your crypto.
              </p>
            </div>
            <CreateWalletButton onClick={handleCreateWalletClick} />
          </div>
        ) : (
          <AddressDisplays seedPhrase={seedPhrase} />
        )}

        {showPopup && seedPhrase && (
          <CreateWalletPopup
            seedPhrase={seedPhrase}
            onClose={() => setShowPopup(false)}
            onConfirm={handleConfirmWallet}
          />
        )}
      </div>
    </div>
  );
}