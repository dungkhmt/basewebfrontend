import React, { useEffect, useState } from 'react';
import './chatVoiceMain.css';
import Host from './host';
import Join from './join';

export default function ChatVoiceMain() {

  const [selectedCard, setSelectedCard] = useState('host');

  const renderHomeMeetContent = () => {
    if(selectedCard === 'host') {
      return (
        <Host />
      );
    }
    if(selectedCard === 'join') {
      return (
        <Join />
      );
    }
    return (
      <div></div>
    );
  }

  return (
    <div className='voice-chat-main' style={{ height: '80vh' }}>
      <div className='title-meet-row'>
        <div className='icon-meet'>M</div>
        <h1 className='title-meet'>Meet</h1>
      </div>
      <div className='card-meet-row'>
        <div className={`card-meet${selectedCard === 'host' ? ' selected-card' : ''}`}>
          <div className='card-name' onClick={() => setSelectedCard('host')}>Host A Meet</div>
        </div>
        <div className={`card-meet${selectedCard === 'join' ? ' selected-card' : ''}`}>
          <div className='card-name' onClick={() => setSelectedCard('join')}>Join A Meet</div>
        </div>
        <div className='card-meet'></div>
      </div>
      <div className='home-meet-content'>
        {renderHomeMeetContent()}
      </div>
    </div>
  );
}
