// import { useState } from 'react';
// import { generateMnemonic } from 'bip39';
// import AddressDisplays from './components/AddressDisplays';

// // import '../App.css';


// function App() {

//   const [showPopup, setShowPopup] = useState(false);
//   const [seedPhrase, setSeedPhrase] = useState<string[] | null>()
//   const [isCopied, setIsCopied] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [showWarning, setShowWarning] = useState(false);


//   const handleCreateWalletClick = () => {
//     setShowPopup(true);

//     try {
//       const mnemonic = generateMnemonic();
//       setSeedPhrase(mnemonic?.split(' '))
//     } catch (error) {
//       console.error(error);

//     }

//   };

//   const handleCopy = () => {

//     if (!seedPhrase) {
//       setShowPopup(false);
//       return;
//     }
//     navigator.clipboard.writeText(seedPhrase?.join(' ')).then(() => {
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 1000); // Reset the copy state after 2 seconds
//     }).catch((error) => {
//       console.error('Failed to copy text: ', error);
//     });
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setIsChecked(event.target.checked);
//     setShowWarning(false); // Hide warning if checkbox is checked
//   };

//   const handleCreateWallet = () => {
//     if (!isChecked) {
//       setShowWarning(true);
//     } else {


//       setShowPopup(false)
//       setIsChecked(false);
//       // Proceed with wallet creation
//     }
//   };

//   return (
//     <>
//       <div className="App">
//         {!seedPhrase ? (<button onClick={handleCreateWalletClick} className="create-wallet-btn">
//           CREATE WALLET
//         </button>) : (
//           <AddressDisplays seedPhrase={seedPhrase} />
//         )}

//         {showPopup && (
//           <div className="popup">
//             <div className="popup-content">
//               <span className="close" onClick={handleClosePopup}>&times;</span>
//               <h2>Create wallet</h2>
//               <p>Write down these words in this exact order. You can use them to access your wallet, make sure you protect them.</p>

//               <div className="word-grid">
//                 {seedPhrase?.map((word, index) => (
//                   <div key={index} className="word">
//                     {index + 1} {word}
//                   </div>
//                 ))}
//               </div>
//               <button onClick={handleCopy}>
//                 {isCopied ? 'Copied!' : 'Copy'}
//               </button>
//               <label>
//                 <input type="checkbox" onChange={handleCheckboxChange} /> I confirm I have written down and safely stored my secret phrase.
//               </label>


//               {showWarning && (
//                 <p style={{ color: 'red' }}>
//                   Please check the box to confirm you have written down your secret phrase.
//                 </p>
//               )}

//               <button className="create-wallet-popup-btn" onClick={handleCreateWallet} >Create Wallet</button>
//             </div>
//           </div>
//         )}
//       </div></>
//   )


// }

// export default App;


import { useState } from 'react';
import { generateMnemonic } from 'bip39';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, AlertCircle, X, Wallet } from 'lucide-react';
import AddressDisplays from './components/AddressDisplays';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[] | null>();
  const [isCopied, setIsCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleCreateWalletClick = () => {
    setShowPopup(true);
    try {
      const mnemonic = generateMnemonic();
      setSeedPhrase(mnemonic?.split(' '));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = () => {
    if (!seedPhrase) {
      setShowPopup(false);
      return;
    }
    navigator.clipboard.writeText(seedPhrase?.join(' '))
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {!seedPhrase ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateWalletClick}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                       rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:shadow-2xl 
                       transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 
                            rounded-xl transition-opacity" />
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6" />
                <span className="text-lg font-semibold">Create New Wallet</span>
              </div>
            </motion.button>
          </div>
        ) : (
          <AddressDisplays seedPhrase={seedPhrase} />
        )}

        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center 
                       justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl 
                         p-6 max-w-2xl w-full shadow-2xl border border-indigo-500/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 
                               to-purple-400 bg-clip-text text-transparent">
                    Create Your Wallet
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPopup(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/20 rounded-xl p-6">
                    <div className="grid grid-cols-3 gap-3">
                      {seedPhrase?.map((word, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          key={index}
                          className="bg-black/30 rounded-lg p-3 flex items-center gap-2"
                        >
                          <span className="text-indigo-400">{index + 1}.</span>
                          <span className="font-medium">{word}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r 
                               from-indigo-600 to-purple-600 py-3 rounded-xl 
                               transition-all duration-300 hover:shadow-lg"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{isCopied ? 'Copied!' : 'Copy Seed Phrase'}</span>
                    </motion.button>

                    <label className="flex items-center gap-3 cursor-pointer 
                                  hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setIsChecked(e.target.checked);
                          setShowWarning(false);
                        }}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded-md
                                 border-2 border-indigo-500/50"
                      />
                      <span className="text-sm text-gray-300">
                        I have safely stored my seed phrase
                      </span>
                    </label>

                    {showWarning && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Please confirm that you've stored your seed phrase</span>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isChecked) {
                          setShowPopup(false);
                          setIsChecked(false);
                        } else {
                          setShowWarning(true);
                        }
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 
                               hover:from-indigo-600 hover:to-purple-600 py-3 
                               rounded-xl transition-all duration-300"
                    >
                      Create Wallet
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;