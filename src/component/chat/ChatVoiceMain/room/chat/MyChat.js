import { useState } from "react";
import handleTime from "./handleTime";

const MyChat = ({ data }) => {
  const [title, setTitle] = useState();
  
  return (
    <div>
      <div className='my-chat' title={title} onMouseEnter={() => setTitle(handleTime(Number(data.time)))}>
        <div className='chat-box my-chat-box'>{data.content}</div>
      </div>     
      <div className='my-chat' title={title} onMouseEnter={() => setTitle(handleTime(Number(data.time)))}>
        <div className='chat-box my-chat-box-hidden'>{data.content}</div>
      </div>
    </div>
  );
}

export default MyChat;