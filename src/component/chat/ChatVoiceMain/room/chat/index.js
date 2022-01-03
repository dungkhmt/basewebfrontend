import AdminChat from "./AdminChat";
import InputChat from "./InputChat";
import MyChat from "./MyChat";
import OthersChat from "./OthersChat";
import { AiOutlineDoubleRight } from 'react-icons/ai';

const Chat = (props) => {  
  const renderListMsg = () => {
    const userId = localStorage.getItem('userId');
    return props.listMsg.map((msg, index) => (msg.id === '0' && msg.name === 'adminMeet') ? <AdminChat key={index} data={msg} /> 
      : (msg.id === userId ? <MyChat key={index} data={msg} /> : <OthersChat key={index} data={msg} />));
  }

  const closeBar = () => {
    props.setDisplay('');
  }

  return (
    <div className={`room-bar transition${props.display === 'chat' ? ' display-bar' : ' hidden-bar'}`}>
      <div className='close-bar' onClick={closeBar}>
        <AiOutlineDoubleRight />
      </div> 
      <div className="title-bar">
        Group Chat
      </div>
      <div className='content-bar chat-bar-content'>
        <div className='list-mess'>
          {renderListMsg()}
        </div>
        <div className='input-chat'>
          <InputChat sendMessage={props.sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chat;