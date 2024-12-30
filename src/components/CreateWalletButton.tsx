
import { Wallet } from 'lucide-react';

interface CreateWalletButtonProps {
  onClick: () => void;
}

export function CreateWalletButton({ onClick }: CreateWalletButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className="group bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 
                 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 
                 transform hover:scale-105 flex items-center gap-3 shadow-lg"
    >
      <Wallet className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
      Create New Wallet
    </button>
  );
}