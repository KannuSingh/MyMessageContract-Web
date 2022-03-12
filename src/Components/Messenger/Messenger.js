import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import './Messenger.css';

function Messenger(props) {
  const [showMessages, setShowMessages] = useState(true);

  const handleShowMessages = () => {
    setShowMessages(!showMessages);
  };
  return (
    <div className="messenger-container">
      <h4 className="messenger-header">Messages</h4>
      <button className="messenger-button" onClick={handleShowMessages}>
        Messages
      </button>
      {showMessages ? (
        <ul className="message-list-container">
          {props.messages.map((message, index) => {
            return <Message key={index} message={message}></Message>;
          })}
        </ul>
      ) : (
        ''
      )}
    </div>
  );
}

//https://codepen.io/jokeyrhyme/pen/eYdpeY   reference this
function Message(props) {
  return (
    <li className="message-container">
      <div className="message-sender-address">
        <button className="copy-icon-btn">
          <MdContentCopy />
        </button>
        {props.message.address}
      </div>

      <div className="message">{props.message.text}</div>
      <div className="message-timestamp">
        {props.message.timestamp.toLocaleDateString('en-US')}
      </div>
    </li>
  );
}

export default Messenger;
