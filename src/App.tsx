
import React from 'react';
import './App.css';
// import { createMnemonic } from './service/solWallet';


import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
// import Wallet from './Pages/Wallet';
import { WalletProvider } from './context/WalletContext';

const App: React.FC = () => {


  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </WalletProvider>
  );
};

export default App;
