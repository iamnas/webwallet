import { useState } from 'react';
import { getSolanaWalletAddress, getSolBalance, sendTransaction } from '../service/solWallet';
import { getEthWalletAddress } from '../service/ethWallet';
import { ADDRESS } from '../types';
import { AddressCard } from './AddressCard';
import { ViewToggle } from './ViewToggle';
import { ReceiveModal } from './modals/ReceiveModal';
import { BalanceModal } from './modals/BalanceModal';
import { SendModal } from './modals/SendModal';

interface AddressDisplaysProps {
  seedPhrase: string[];
}

export default function AddressDisplays({ seedPhrase }: AddressDisplaysProps) {
  const [showSolana, setShowSolana] = useState(true);
  const [solanaAddresses, setSolanaAddresses] = useState<ADDRESS[]>();
  const [evmAddresses, setEvmAddresses] = useState<ADDRESS[]>();
  const [numAddresses, setNumAddresses] = useState(1);
  const [showReceivePopup, setShowReceivePopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ADDRESS | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [showBalancePopup, setShowBalancePopup] = useState(false);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [sendAddress, setSendAddress] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<string | JSX.Element | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const generateSolanaAddresses = () => {
    if (!seedPhrase?.length) return;
    const seed = seedPhrase.join(' ');
    const seedBuffer = Buffer.from(seed, 'utf8');
    const addresses = getSolanaWalletAddress(seedBuffer, numAddresses).map(address => ({
      ...address,
      showPrivateKey: false,
    }));
    setSolanaAddresses(addresses);
  };

  const generateEvmAddresses = () => {
    if (!seedPhrase?.length) return;
    const seed = seedPhrase.join(' ');
    const addresses = getEthWalletAddress(seed, numAddresses).map(address => ({
      ...address,
      showPrivateKey: false,
    }));
    setEvmAddresses(addresses);
  };

  const handleShowSolana = () => {
    setShowSolana(true);
    generateSolanaAddresses();
  };

  const handleShowEvm = () => {
    setShowSolana(false);
    generateEvmAddresses();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return;
    
    const addresses = showSolana ? [...(solanaAddresses || [])] : [...(evmAddresses || [])];
    const [draggedItem] = addresses.splice(draggedIndex, 1);
    addresses.splice(dropIndex, 0, draggedItem);
    
    if (showSolana) {
      setSolanaAddresses(addresses);
    } else {
      setEvmAddresses(addresses);
    }
    
    setDraggedIndex(null);
  };

  const toggleShowPrivateKey = (index: number, isSolana: boolean) => {
    if (isSolana) {
      const updatedAddresses = solanaAddresses?.map((address, i) =>
        i === index ? { ...address, showPrivateKey: !address.showPrivateKey } : address
      );
      setSolanaAddresses(updatedAddresses);
    } else {
      const updatedAddresses = evmAddresses?.map((address, i) =>
        i === index ? { ...address, showPrivateKey: !address.showPrivateKey } : address
      );
      setEvmAddresses(updatedAddresses);
    }
  };

  const handleReceive = (address: ADDRESS) => {
    setSelectedAddress(address);
    setShowReceivePopup(true);
  };

  const handleBalance = async (address: ADDRESS) => {
    setSelectedAddress(address);
    const balance = await getSolBalance(address.publicKey);
    setBalance(balance);
    setShowBalancePopup(true);
  };

  const handleSend = (address: ADDRESS) => {
    setSelectedAddress(address);
    setShowSendPopup(true);
  };

  const handleSendTransaction = async () => {
    if (!selectedAddress) return;
    
    try {
      setTransactionStatus('Sending...');
      const tx = await sendTransaction(selectedAddress.privateKey, sendAddress, sendAmount);
      const txLink = `https://explorer.solana.com/tx/${tx}?cluster=devnet`;
      setTransactionStatus(
        <span>
          Transaction successful! View it on{' '}
          <a href={txLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            Solscan
          </a>
        </span>
      );
    } catch {
      setTransactionStatus('Error: Transaction failed');
    } finally {
      setShowSendPopup(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={handleShowSolana}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showSolana ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            Solana Address
          </button>
          <button
            onClick={handleShowEvm}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !showSolana ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            EVM Address
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <ViewToggle isGridView={isGridView} onToggle={setIsGridView} />
          <div className="flex items-center gap-2">
            <label htmlFor="numAddresses" className="text-gray-300">Addresses:</label>
            <input
              id="numAddresses"
              type="number"
              value={numAddresses}
              onChange={(e) => setNumAddresses(Number(e.target.value))}
              min="1"
              className="bg-gray-700 text-white px-3 py-2 rounded-lg w-20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">
          {showSolana ? 'Solana' : 'EVM'} Addresses
        </h2>
        
        <div className={`${isGridView ? 'flex flex-wrap gap-4' : 'space-y-4'}`}>
          {(showSolana ? solanaAddresses : evmAddresses)?.map((address, index) => (
            <AddressCard
              key={index}
              address={address}
              index={index}
              showSolana={showSolana}
              isGridView={isGridView}
              draggedIndex={draggedIndex}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onTogglePrivateKey={toggleShowPrivateKey}
              onReceive={handleReceive}
              onBalance={handleBalance}
              onSend={handleSend}
            />
          ))}
        </div>
      </div>

      {showReceivePopup && selectedAddress && (
        <ReceiveModal
          address={selectedAddress}
          onClose={() => setShowReceivePopup(false)}
        />
      )}

      {showBalancePopup && selectedAddress && balance !== null && (
        <BalanceModal
          address={selectedAddress}
          balance={balance}
          onClose={() => setShowBalancePopup(false)}
        />
      )}

      {showSendPopup && selectedAddress && (
        <SendModal
          address={selectedAddress}
          amount={sendAmount}
          recipientAddress={sendAddress}
          onAmountChange={setSendAmount}
          onAddressChange={setSendAddress}
          onSend={handleSendTransaction}
          onClose={() => setShowSendPopup(false)}
        />
      )}

      {transactionStatus && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          {transactionStatus}
        </div>
      )}
    </div>
  );
}
