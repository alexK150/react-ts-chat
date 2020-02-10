import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react';

import './App.css';

const App = () => {

    const [message, setMessage] = useState('');
    // @ts-ignore
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('wss://social-network.samuraijs.com/handlers/chatHandler.ashx');
        setSocket(socket);

        // @ts-ignore
        window.socket = socket;

        socket.onmessage = (event: MessageEvent) => {
            console.log('Получены данные: ' + event.data);
            let messagesFromServer = JSON.parse(event.data);
            setMessages((actualMessages) => [...messagesFromServer.reverse(), ...actualMessages])
        };

    }, []);

    const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
    };

    const sendMessage = () => {
        socket!.send(message);
        setMessage('');
    };

    const onKeyPress =(e: KeyboardEvent<HTMLTextAreaElement>)=>{
        if(e.ctrlKey && e.charCode === 13){
            sendMessage();
        }
    };

    return (
        <div className="App">
      <textarea
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          value={message}>
      </textarea>
            <button onClick={sendMessage}>Send</button>
            <hr/>
            <div style={{height: '400px', overflowY: 'scroll'}}>
                {
                    messages.map((m, index) => {
                        return <div key={index}>
                            <b>{m.userName}: </b>{m.message}
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default App;
