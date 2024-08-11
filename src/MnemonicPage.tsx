import React, { useState } from 'react';

const MnemonicPage: React.FC = () => {
  const [confirmed, setConfirmed] = useState(false);

  const handleCreateWallet = () => {
    if (confirmed) {
      // Proceed with wallet creation
      alert('Wallet created!');
    }
  };

  return (
    <div className="mnemonic-container">
      <h2>Create Wallet</h2>
      <p>Write down these words in this exact order. You can use them to access your wallet; make sure you protect them.</p>
      <div className="mnemonic-words">
        {/* Replace with actual mnemonic words */}
        <span>1. answer</span>
        <span>2. unit</span>
        {/* Add more words as needed */}
      </div>
      <div>
        <input type="checkbox" id="confirm" checked={confirmed} onChange={() => setConfirmed(!confirmed)} />
        <label htmlFor="confirm">I confirm I have written down and safely stored my secret phrase.</label>
      </div>
      <button onClick={handleCreateWallet} disabled={!confirmed}>Create Wallet</button>
    </div>
  );
};

export default MnemonicPage;
