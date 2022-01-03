import { useState } from "react";
import handleTime from "./handleTime";

const AdminChat = ({ data }) => {
  const userId = localStorage.getItem('userId');
  const content = JSON.parse(data.content);
  const [title, setTitle] = useState();
  return (
    <div className='admin-chat' title={title} onMouseEnter={() => setTitle(handleTime(Number(data.time)))}>
      {content.id === userId ? 
        (content.type === 'join' ? `Welcome ${content.name} to the chat room` : '') :
        (content.type === 'join' ? `${content.name} has joined the room` : 
          (content.type === 'leave' ? `${content.name} has left the room` : ''))}
    </div>
  );
}

export default AdminChat;