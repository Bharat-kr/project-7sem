import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../utils/constants';

const HealthChainContext = createContext({
  // Initial context state
  provider: null,
  signer: null,
  contract: null,
  account: null,
  role: null,
  isConnecting: true,
  error: null,

  // Contract interaction functions
  connectWallet: () => {},
  addDoctor: (name, age, gender, hospitalName) => {},
  getDoctor: () => {},
  addPatient: (name, age, gender) => {},
  getPatient: () => {},
  addDisease: (diseaseId, name, doctorAddress) => {},
  getDiseases: () => {},
  addRecord: (diseaseId, recordName, url, uploadDate) => {},
  getRecords: (diseaseId) => {}
});

const HealthChainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connect = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // await provider.enable();
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(
          // Your contract address
          contractAddress,
          contractAbi,
          signer
        );
        const address = await signer.getAddress();
        const role = await contract.getStatus();
        console.log(role);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(address);
        setRole(role);
        setIsConnecting(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setIsConnecting(false);
      }
    };

    connect();
  }, []);

  // Function definitions: Replace with your contract function logic using 'contract' instance

  const connectWallet = async () => {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      const address = await signer.getAddress();
      const role = await contract.getStatus();

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAccount(address);
      setRole(role);
      setIsConnecting(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsConnecting(false);
    }
  };

  // Add similar function definitions for other contract functionalities

  const value = {
    provider,
    signer,
    contract,
    account,
    role,
    isConnecting,
    error,
    connectWallet
    // Add contract interaction functions
  };

  return <HealthChainContext.Provider value={value}>{children}</HealthChainContext.Provider>;
};

export { HealthChainContext, HealthChainProvider };
