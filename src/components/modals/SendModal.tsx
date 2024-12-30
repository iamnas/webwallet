import { ADDRESS } from '../../types';

interface SendModalProps {
  address: ADDRESS;
  amount: number;
  recipientAddress: string;
  onAmountChange: (amount: number) => void;
  onAddressChange: (address: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export function SendModal({
  amount,
  recipientAddress,
  onAmountChange,
  onAddressChange,
  onSend,
  onClose,
}: SendModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">Send SOL</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          placeholder="Amount to send"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
        />
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Enter Solana wallet address"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}