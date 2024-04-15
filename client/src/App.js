import { useState } from 'react';
import './App.css';
import io from 'socket.io-client'
import Chat from './Chat';

const socket = io.connect("http://localhost:3002")

function App() {
  //keep track of input values
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  
  //send event to backend with socket.emit
  const joinRoom = () => {
    if (username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  return (
    <div className="App">
      {!showChat ? (
      <div className="joinChatCointainer">
        <h3>Join a chat</h3>
        <input 
          type="text" placeholder="Name" onChange={(event) => setUsername(event.target.value)}
        />
        <input 
          type="text" placeholder="Room ID" onChange={(event) => setRoom(event.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
      ) : (
      <Chat socket={socket} username={username} room={room}/>
    )}
    </div>
  );
}

export default App;
