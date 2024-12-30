import { ADDRESS } from '../../types';

interface ReceiveModalProps {
  address: ADDRESS;
  onClose: () => void;
}

export function ReceiveModal({ address, onClose }: ReceiveModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">Your Wallet Address</h2>
        <div className="flex justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address.publicKey}`}
            alt="QR Code"
            className="rounded-lg"
          />
        </div>
        <p className="text-sm font-mono bg-gray-700 p-2 rounded break-all">{address.publicKey}</p>
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