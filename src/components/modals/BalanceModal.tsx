import { ADDRESS } from '../../types';

interface BalanceModalProps {
  address: ADDRESS;
  balance: number;
  onClose: () => void;
}

export function BalanceModal({ address, balance, onClose }: BalanceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">Balance</h2>
        <p className="text-2xl font-bold text-center">{balance} SOL</p>
        <div className="flex justify-between">
          <a
            href={`https://solscan.io/account/${address.publicKey}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            View on Solscan
          </a>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}