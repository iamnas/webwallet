import  { useState } from 'react';
import { Wallet,  Copy, AlertCircle } from 'lucide-react';
import { generateMnemonic } from 'bip39';
import AddressDisplays from './AddressDisplays';

// Home Component
const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[] | null>();
  const [isCopied, setIsCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleCreateWalletClick = () => {
    setShowPopup(true);
    try {
      const mnemonic = generateMnemonic();
      setSeedPhrase(mnemonic?.split(' '));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = () => {
    if (!seedPhrase) {
      setShowPopup(false);
      return;
    }
    navigator.clipboard.writeText(seedPhrase?.join(' '))
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {!seedPhrase ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <button
              onClick={handleCreateWalletClick}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity" />
              <div className="flex items-center space-x-3">
                <Wallet className="w-6 h-6" />
                <span className="text-lg font-semibold">Create New Wallet</span>
              </div>
            </button>
          </div>
        ) : (
          <AddressDisplays seedPhrase={seedPhrase} />
        )}

        {/* Seed Phrase Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Create Your Wallet
                </h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {seedPhrase?.map((word, index) => (
                      <div key={index} className="bg-gray-600 rounded p-2 flex items-center space-x-2">
                        <span className="text-blue-400">{index + 1}.</span>
                        <span>{word}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{isCopied ? 'Copied!' : 'Copy Seed Phrase'}</span>
                  </button>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setIsChecked(e.target.checked);
                        setShowWarning(false);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-300">
                      I have safely stored my seed phrase
                    </span>
                  </label>

                  {showWarning && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Please confirm that you've stored your seed phrase</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isChecked) {
                        setShowPopup(false);
                        setIsChecked(false);
                      } else {
                        setShowWarning(true);
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 rounded-lg transition-all duration-300"
                  >
                    Create Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default Home;