import React, { useState, useEffect } from 'react';
import * as ethers from 'ethers';
import { contractAbi, contractAddress } from '../utils/constants';
export const Web3Context = React.createContext();

const { ethereum } = window;

const getEthererumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer);

  return transactionContract;
};

export const Web3Provider = ({ children }) => {
  const [user, setUser] = useState({});
  const [connectedAccount, setConnectedAccount] = useState('');

  useEffect(() => {}, []);

  return (
    <Web3Context.Provider
      value={{
        connectedAccount,
        user,
        setUser
      }}>
      {children}
    </Web3Context.Provider>
  );
};
