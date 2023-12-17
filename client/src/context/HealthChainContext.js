import React, { createContext, useState, useEffect, useContext } from 'react';
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
  getStatus: () => {},
  addDoctor: (name, age, gender, hospitalName) => {},
  getDoctor: () => {},
  addPatient: (name, age, gender) => {},
  getPatient: () => {},
  addDisease: (diseaseId, name, doctorAddress) => {},
  getDiseases: () => {},
  addRecord: (diseaseId, recordName, url, uploadDate) => {},
  getRecords: (diseaseId) => {},
  getPatientDiseases: (patient) => {}
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
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        const address = await window.ethereum.request({ method: 'eth_accounts' });
        console.log(address);
        if (address.length > 0) {
          setAccount(address[0]);
          const currRole = await contract.getStatus();
          setRole(currRole);
          console.log(currRole);
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsConnecting(false);
      }
    };

    connect();
  }, []);

  // Function definitions: Replace with your contract function logic using 'contract' instance

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const currRole = await contract.getStatus();
        setRole(currRole);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Add similar function definitions for other contract functionalities

  const addDoctor = async (name, age, gender, hospital) => {
    try {
      const transaction = await contract.addDoctor(name, age, gender, hospital, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 1000000
      });
      const transactionReceipt = await transaction.wait();
      if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
      }
      console.log(transactionReceipt);
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctor = async () => {
    try {
      const data = await contract.getDoctor();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const addPatient = async (name, age, gender) => {
    try {
      const transaction = await contract.addPatient(name, age, gender, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 1000000
      });
      const transactionReceipt = await transaction.wait();
      if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
      }
      console.log(transactionReceipt);
    } catch (error) {
      console.log(error);
    }
  };

  const getPatient = async () => {
    try {
      const data = await contract.getPatient();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const addDisease = async (diseaseId, name, doctorAddress) => {
    try {
      const transaction = await contract.addDisease(diseaseId, name, doctorAddress, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 1000000
      });
      const transactionReceipt = await transaction.wait();
      if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
      }
      console.log(transactionReceipt);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiseases = async () => {
    try {
      const data = await contract.getDiseases();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPatientDiseases = async (patient) => {
    try {
      const data = await contract.getPatientDiseases(patient);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPatients = async () => {
    try {
      const data = await contract.getAllPatients();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const addRecord = async (name, url, uploadDate, diseaseId) => {
    try {
      const transaction = await contract.addRecord(name, url, uploadDate, diseaseId, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: 1000000
      });
      const transactionReceipt = await transaction.wait();
      if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
      }
      console.log(transactionReceipt);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecords = async () => {
    try {
      const data = await contract.getRecords();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const value = {
    provider,
    signer,
    contract,
    account,
    role,
    isConnecting,
    error,
    connectWallet,
    addDoctor,
    getDoctor,
    getPatient,
    addPatient,
    getAllPatients,
    addDisease,
    getDiseases,
    addRecord,
    getRecords,
    getPatientDiseases
  };

  return <HealthChainContext.Provider value={value}>{children}</HealthChainContext.Provider>;
};

const useContract = () => useContext(HealthChainContext);

export { useContract, HealthChainProvider };
