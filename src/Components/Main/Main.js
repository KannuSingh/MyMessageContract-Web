import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Main.css';
import { contractAddress } from '../../utils/helper';
import contractABI from '../../utils/MyMessageContract.json';

function Main(props) {
  const [message, setMessage] = useState('');

  const postMessage = async (event) => {
    event.preventDefault();
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

        let count = await myMessageContract.getTotalMessages();
        console.log('Retrieved total message count...', count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */

        const messageTxn = await myMessageContract.message(message);
        console.log('Mining...', messageTxn.hash);

        await messageTxn.wait();
        console.log('Mined -- ', messageTxn.hash);

        count = await myMessageContract.getTotalMessages();
        console.log('Retrieved total message count...', count.toNumber());
        setMessage('');
      } else {
        alert(
          'Make sure you have metamask and you have connected your wallet!'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className="main">
      <div className="main-data-container">
        <div className="header">👋 Hey there!</div>

        <p className="bio">
          I am Karandeep and I am working on decentralized fantasy sport game.
          Connect your Ethereum wallet ( rinkeby testnet) and leave a msg!
        </p>
        {props.currentAccount && (
          <form id="messageForm" onSubmit={postMessage}>
            <textarea
              className="input-text-message"
              name="message"
              rows="6"
              cols="50"
              value={message}
              onChange={handleMessageChange}
            ></textarea>

            <input className="btn" type="submit" value=" Send" />
          </form>
        )}

        {/*
         * If there is no currentAccount render this button
         */}
        {!props.currentAccount && (
          <button className="btn" onClick={props.connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default Main;
