import React, { useEffect, useState } from 'react';

function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: 
                    new Date(Date.now()).getHours() 
                    + ":" + 
                    new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };
  
    useEffect(() => {
        socket.on("recieve_message", (message) => {
            //appends data to existing list
            setMessageList((list) => [...list, message])
        })
    }, [socket]);

    return (
    <>
    <div className="chat-window">
        <div className='chat-header'>
            <p>Room #{room}</p>
        </div>
        <div className='chat-body'>
            {messageList.map((messageContent) => {
                return (
                    <div
                        className="message"
                        id={username === messageContent.author ? "you" : "other"}
                    >
                    <div>
                        <div className="message-content">
                            <p>Message: {messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                            <p id="time">Time sent: {messageContent.time}</p>
                            <p id="author">Sent by: {messageContent.author}</p>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
        <div className='chat-footer'>
            <input type="text" placeholder="Send a message..." onChange={(event) => setCurrentMessage(event.target.value)}/>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
    </>
  );
}

export default Chat;