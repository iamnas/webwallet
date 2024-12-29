import { useState } from 'react';
import { getSolanaWalletAddress, getSolBalance, sendTransaction } from '../service/solWallet';
import { getEthWalletAddress } from '../service/ethWallet';
import { Eye, EyeOff, Send, Wallet, Grid, List } from 'lucide-react';

interface ADDRESS {
    publicKey: string;
    privateKey: string;
    showPrivateKey: boolean;
}

function AddressDisplays({ seedPhrase }: { seedPhrase: string[] }) {
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
        const seed = seedPhrase.join(' ');
        const seedBuffer = Buffer.from(seed, 'utf8');
        const addresses = getSolanaWalletAddress(seedBuffer, numAddresses).map(address => ({
            ...address,
            showPrivateKey: false,
        }));
        setSolanaAddresses(addresses);
    };

    const generateEvmAddresses = () => {
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
        try {
            setTransactionStatus('Sending...');
            const tx = await sendTransaction(selectedAddress!.privateKey, sendAddress, sendAmount);
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

    const AddressCard = ({ address, index }: { address: ADDRESS; index: number }) => (
        <div
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`${isGridView ? 'w-full md:w-[calc(50%-0.5rem)]' : 'w-full'} 
                       bg-gray-800 rounded-lg p-4 space-y-3 cursor-move
                       hover:shadow-lg transition-shadow duration-200
                       ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
        >
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-gray-400">Public Key</span>
                    <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded">{address.publicKey}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-gray-400">Private Key</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded">
                            {address.showPrivateKey ? address.privateKey : '**********'}
                        </span>
                        <button
                            onClick={() => toggleShowPrivateKey(index, showSolana)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            {address.showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {showSolana && (
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => handleReceive(address)}
                        className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors flex-1"
                    >
                        <Wallet className="w-4 h-4" />
                        Receive
                    </button>
                    <button
                        onClick={() => handleBalance(address)}
                        className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors flex-1"
                    >
                        Balance
                    </button>
                    <button
                        onClick={() => handleSend(address)}
                        className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg transition-colors flex-1"
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                    <a
                        href="https://faucet.solana.com/"
                        target="_blank"
                        className="flex items-center justify-center gap-1 bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded-lg transition-colors flex-1 text-white"
                    >
                        Faucet
                    </a>
                </div>
            )}
        </div>
    );

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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsGridView(true)}
                            className={`p-2 rounded-lg transition-colors ${
                                isGridView ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsGridView(false)}
                            className={`p-2 rounded-lg transition-colors ${
                                !isGridView ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
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
                        <AddressCard key={index} address={address} index={index} />
                    ))}
                </div>
            </div>

            {/* Modals remain unchanged */}
            {showReceivePopup && selectedAddress && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
                        <h2 className="text-xl font-semibold text-center">Your Wallet Address</h2>
                        <div className="flex justify-center">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAddress.publicKey}`}
                                alt="QR Code"
                                className="rounded-lg"
                            />
                        </div>
                        <p className="text-sm font-mono bg-gray-700 p-2 rounded break-all">{selectedAddress.publicKey}</p>
                        <div className="flex justify-between">
                            <a
                                href={`https://solscan.io/account/${selectedAddress.publicKey}?cluster=devnet`}
                                target="_blank"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                View on Solscan
                            </a>
                            <button
                                onClick={() => setShowReceivePopup(false)}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBalancePopup && selectedAddress && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
                        <h2 className="text-xl font-semibold text-center">Balance</h2>
                        <p className="text-2xl font-bold text-center">{balance} SOL</p>
                        <div className="flex justify-between">
                            <a
                                href={`https://solscan.io/account/${selectedAddress.publicKey}?cluster=devnet`}
                                target="_blank"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                View on Solscan
                            </a>
                            <button
                                onClick={() => setShowBalancePopup(false)}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSendPopup && selectedAddress && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
                        <h2 className="text-xl font-semibold text-center">Send SOL</h2>
                        <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(Number(e.target.value))}
                            placeholder="Amount to send"
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                        />
                        <input
                            type="text"
                            value={sendAddress}
                            onChange={(e) => setSendAddress(e.target.value)}
                            placeholder="Enter Solana wallet address"
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSendPopup(false)}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendTransaction}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {transactionStatus && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
                    {transactionStatus}
                </div>
            )}
        </div>
    );
}

export default AddressDisplays;