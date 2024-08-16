import { getSolanaWalletAddress, getSolBalance, sendTransaction } from '../service/solWallet';
import { getEthWalletAddress } from '../service/ethWallet';
import { useState } from 'react';
import './AddressDisplay.css';

interface ADDRESS {
    publicKey: string;
    privateKey: string;
    showPrivateKey: boolean;
}

function AddressDisplay({ seedPhrase }: { seedPhrase: string[] }) {
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
    // const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<string | JSX.Element | null>(null);


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
        // Mock fetching balance
        const balance = await getSolBalance(address.publicKey);
        setBalance(balance); // Replace with actual balance fetching logic
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
                    <a href={txLink} target="_blank" rel="noopener noreferrer">
                        Solscan
                    </a>.
                </span>
            );
        } catch {
            setTransactionStatus('Error: Transaction failed');
        } finally {
            setShowSendPopup(false);
        }
    };



    return (
        <div className="container">
            <div className="button-group">
                <button className={`tab-button ${showSolana ? 'active' : ''}`} onClick={handleShowSolana}>
                    Show Solana Address
                </button>
                <button className={`tab-button ${!showSolana ? 'active' : ''}`} onClick={handleShowEvm}>
                    Show EVM Address
                </button>
            </div>

            <div className="address-input">
                <label htmlFor="numAddresses">Number of Addresses:</label>
                <input
                    id="numAddresses"
                    type="number"
                    value={numAddresses}
                    onChange={(e) => setNumAddresses(Number(e.target.value))}
                    min="1"
                />
            </div>

            {showSolana ? (
                <div className="address-box">
                    <h2>Solana Addresses</h2>
                    {solanaAddresses?.map((address, index) => (
                        <div key={index} className="address-item">
                            <p>Public Key &nbsp;<span className="key">{address.publicKey}</span></p>
                            <p>
                                Private Key &nbsp;
                                <span className="key">{address.showPrivateKey ? address.privateKey : '**********'}</span>
                                <button
                                    className="private-key-button"
                                    onClick={() => toggleShowPrivateKey(index, true)}
                                >
                                    {address.showPrivateKey ? 'Hide' : 'Show'} Private Key
                                </button>
                            </p>
                            <p style={{ marginTop: '8px' }}>
                                <button className="private-key-button" onClick={() => handleReceive(address)}>RECEIVE</button>
                                <button className="private-key-button" onClick={() => handleBalance(address)}>BALANCE</button>
                                <button className="private-key-button" onClick={() => handleSend(address)}>SEND</button>
                                <a className="private-key-button" href="https://faucet.solana.com/" target='_blank' style={{ textDecoration: "none", color: 'white' }}>FAUCET</a>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="address-box">
                    <h2>EVM Addresses</h2>
                    {evmAddresses?.map((address, index) => (
                        <div key={index} className="address-item">
                            <p>Public Key :&nbsp; <span className="key">{address.publicKey}</span></p>
                            <p>
                                Private Key :&nbsp;
                                <span className="key">{address.showPrivateKey ? address.privateKey : '**********'}</span>
                                <button
                                    className="private-key-button"
                                    onClick={() => toggleShowPrivateKey(index, false)}
                                >
                                    {address.showPrivateKey ? 'Hide' : 'Show'} Private Key
                                </button>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {showReceivePopup && selectedAddress && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Your Wallet Address</h2>
                        <div className="qr-code">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAddress.publicKey}`}
                                alt="QR Code"
                            />
                        </div>
                        <p className="wallet-address">{selectedAddress.publicKey}</p>
                        <div className="popup-actions">
                            <a href={`https://solscan.io/account/${selectedAddress.publicKey}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
                                View on Solscan
                            </a>
                            <button className="private-key-button" onClick={() => setShowReceivePopup(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {showBalancePopup && selectedAddress && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Balance</h2>
                        <p>Balance: {balance} SOL</p>
                        <div className="popup-actions">
                            <a href={`https://solscan.io/account/${selectedAddress.publicKey}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
                                View on Solscan
                            </a>
                            <button className="private-key-button" onClick={() => setShowBalancePopup(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {showSendPopup && selectedAddress && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Send SOL</h2>
                        <input
                            className="input-box"
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(Number(e.target.value))}
                            placeholder="Amount to send"
                        />
                        <input
                            className="input-box"
                            type="text"
                            value={sendAddress}
                            onChange={(e) => setSendAddress(e.target.value)}
                            placeholder="Enter Solana wallet address"
                        />
                        <div className="popup-actions">
                            <button className="private-key-button" onClick={handleSendTransaction}>Send</button>
                            <button className="private-key-button" onClick={() => setShowSendPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {transactionStatus && (
                <div className="transaction-status">
                    {transactionStatus}
                </div>
            )}
            
        </div>
    );
}

export default AddressDisplay;
