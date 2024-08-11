import { useState } from 'react';
import './AddressDisplay.css'; // Import your CSS for custom styles
import { getSolanaWalletAddress } from './service/solWallet';
import { getEthWalletAddress } from './service/ethWallet';

interface ADDRESS{ publicKey: string, privateKey: string, showPrivateKey: boolean }

function AddressDisplay({ seedPhrase }: { seedPhrase: string[] }) {
    const [showSolana, setShowSolana] = useState(true);
    const [solanaAddresses, setSolanaAddresses] = useState<ADDRESS[]>();
    const [evmAddresses, setEvmAddresses] = useState<ADDRESS[]>();
    const [numAddresses, setNumAddresses] = useState(1);

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

        // const addresses:ADDRESS[] = Array.from({ length: numAddresses }, (_, i) => ({
        //     publicKey: `EvmPublicKey${i + 1}`,
        //     privateKey: `EvmPrivateKey${i + 1}`,
        //     showPrivateKey: false,
        // }));
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
                            <p>Public Key :&nbsp;<span className="key">{address.publicKey}</span></p>
                            <p>
                                Private Key :&nbsp;
                                <span className="key">{address.showPrivateKey ? address.privateKey : '**********'}</span>
                                <button
                                    className="private-key-button"
                                    onClick={() => toggleShowPrivateKey(index, true)}
                                >
                                    {address.showPrivateKey ? 'Hide' : 'Show'} Private Key
                                </button>
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
        </div>
    );
}

export default AddressDisplay;
