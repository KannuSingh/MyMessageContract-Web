import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Main from './Components/Main/Main';
import Messenger from './Components/Messenger/Messenger';
import contractABI from './utils/MyMessageContract.json';
import { contractAddress } from './utils/helper';

function App() {
  const [allMessages, setAllMessages] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');

  //const contractAddress = '0x579fD32Bf74Df5eFEB1943a771E6A67F64cCF474';
  //const contractABI = contractABI.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      /*
       * First make sure we have access to window.ethereum
       */
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamask!');
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllMessages = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const myMessageContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const messages = await myMessageContract.getAllMessages();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let messagesCleaned = [];
        messages.forEach((message) => {
          messagesCleaned.push({
            address: message.sender,
            timestamp: new Date(message.timestamp * 1000),
            text: message.text,
          });
        });

        /*
         * Store our data in React State
         */
        setAllMessages(messagesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(async () => {
    checkIfWalletIsConnected();
    await getAllMessages();
    let myMessageContract;

    const onNewMessage = (from, timestamp, message) => {
      console.log('NewMessage', from, timestamp, message);
      setAllMessages((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          text: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      myMessageContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );
      myMessageContract.on('NewMessage', onNewMessage);
    }

    return () => {
      if (myMessageContract) {
        myMessageContract.off('NewMessage', onNewMessage);
      }
    };
  }, []);
  return (
    <div className="App">
      <NavigationBar />
      <Main connectWallet={connectWallet} currentAccount={currentAccount} />
      <Messenger messages={allMessages} />
    </div>
  );
}

export default App;
