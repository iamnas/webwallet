import { useState } from 'react';
import { SeedPhraseGrid } from './SeedPhraseGrid';
import { Copy, AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface CreateWalletPopupProps {
  seedPhrase: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export function CreateWalletPopup({ seedPhrase, onClose, onConfirm }: CreateWalletPopupProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase.join(' '));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleConfirm = () => {
    if (!isChecked) {
      setShowWarning(true);
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-xl w-full 
                      space-y-6 border border-slate-700/50 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Backup Your Wallet
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-900/50 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-amber-400 font-semibold">Critical Security Warning</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Never share your seed phrase. Anyone with these words can steal your funds. 
              Store them securely offline and never share them with anyone.
            </p>
          </div>
        </div>

        <SeedPhraseGrid seedPhrase={seedPhrase} />

        <button
          onClick={handleCopy}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg 
                     transition-colors flex items-center justify-center gap-2"
        >
          <Copy className={`w-4 h-4 ${isCopied ? 'text-emerald-400' : 'text-white'}`} />
          {isCopied ? 'Copied Successfully!' : 'Copy Seed Phrase'}
        </button>

        <label className="flex items-start gap-3 bg-slate-800 p-4 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              setShowWarning(false);
            }}
            className="mt-1"
          />
          <span className="text-sm text-slate-300 leading-relaxed">
            I understand that if I lose my seed phrase, I will not be able to access my wallet. 
            I confirm that I have securely stored these words.
          </span>
        </label>

        {showWarning && (
          <p className="text-amber-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Please confirm that you have saved your seed phrase
          </p>
        )}

        <button
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 
                     hover:from-emerald-600 hover:to-teal-500 text-white py-3 
                     rounded-lg transition-all duration-200 font-semibold shadow-lg"
        >
          I've Saved My Seed Phrase
        </button>
      </div>
    </div>
  );
}