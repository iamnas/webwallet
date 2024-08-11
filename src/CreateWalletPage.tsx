import React, { useState } from 'react';

const CreateWalletPage: React.FC = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const handleContinue = () => {
    if (checked1 && checked2) {
      // Navigate to the mnemonic page
      window.location.href = '/mnemonic';
    }
  };

  return (
    <div className="create-wallet-container">
      <h2>Create Wallet</h2>
      <p>Blockchains do not have a "Reset Password" feature. All you get is a Secret Phrase - make sure to keep it safe.</p>
      <div>
        <input type="checkbox" id="check1" checked={checked1} onChange={() => setChecked1(!checked1)} />
        <label htmlFor="check1">I understand I have to be extra careful to save my secret phrase and backup my private keys. My money will depend on it.</label>
      </div>
      <div>
        <input type="checkbox" id="check2" checked={checked2} onChange={() => setChecked2(!checked2)} />
        <label htmlFor="check2">I understand that by using this wallet I will be transferring real EGLD tokens.</label>
      </div>
      <button onClick={handleContinue} disabled={!checked1 || !checked2}>Continue</button>
    </div>
  );
};

export default CreateWalletPage;
