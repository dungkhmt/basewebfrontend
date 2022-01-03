import { useState } from "react";
import handleTime from "./handleTime";

const OthersChat = ({ data }) => {
  const [title, setTitle] = useState();
  return (
    <div className='other-chat' title={title} onMouseEnter={() => setTitle(handleTime(Number(data.time)))}>
      <div className='chat-title'>{data.name}</div>
      <div className='chat-box others-chat-box'>{data.content}</div>
    </div>
  );
}

export default OthersChat;