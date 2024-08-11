
import React, { useState } from 'react';
import './App.css';
// import { createMnemonic } from './service/solWallet';

import { generateMnemonic } from "bip39";
import AddressDisplay from './AddressDisplay';

const App: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[] | null>()
  const [isCopied, setIsCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);


  const handleCreateWalletClick = () => {
    setShowPopup(true);

    try {
      const mnemonic = generateMnemonic();
      setSeedPhrase(mnemonic?.split(' '))
    } catch (error) {
      console.error(error);

    }

    // setSeedPhrase([data])
  };


  const handleCopy = () => {

    if (!seedPhrase) {
      setShowPopup(false);
      return;
    }
    navigator.clipboard.writeText(seedPhrase?.join(' ')).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset the copy state after 2 seconds
    }).catch((error) => {
      console.error('Failed to copy text: ', error);
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setShowWarning(false); // Hide warning if checkbox is checked
  };

  const handleCreateWallet = () => {
    if (!isChecked) {
      setShowWarning(true);
    } else {


      setShowPopup(false)
      setIsChecked(false);
      // Proceed with wallet creation
    }
  };


  return (
    <div className="App">
      {!seedPhrase ? (<button onClick={handleCreateWalletClick} className="create-wallet-btn">
        CREATE WALLET
      </button>) : (
        <AddressDisplay seedPhrase={seedPhrase} />
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>&times;</span>
            <h2>Create wallet</h2>
            <p>Write down these words in this exact order. You can use them to access your wallet, make sure you protect them.</p>

            <div className="word-grid">
              {seedPhrase?.map((word, index) => (
                <div key={index} className="word">
                  {index + 1} {word}
                </div>
              ))}
            </div>
            <button onClick={handleCopy}>
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <label>
              <input type="checkbox" onChange={handleCheckboxChange} /> I confirm I have written down and safely stored my secret phrase.
            </label>


            {showWarning && (
              <p style={{ color: 'red' }}>
                Please check the box to confirm you have written down your secret phrase.
              </p>
            )}

            <button className="create-wallet-popup-btn" onClick={handleCreateWallet} >Create Wallet</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
