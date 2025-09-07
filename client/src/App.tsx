import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client'
import type { ChatMessage } from "../../shared/c-types.ts";
import './App.css'

const socket: Socket = io("http://localhost:3000");

export default function App() {
    const [username] = useState(() => "User" + Math.floor(Math.random() * 1000));
  const [messages, SetMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    socket.on("chatMessage", (msg: ChatMessage) => {
      SetMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!text) return;
    const msg: ChatMessage = { user: username, text };
    socket.emit("chatMessage", msg);
    setText("");
  };

  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="chat-container">
        <div className="chat-header"> Chat App</div>

        <div className="messages">
          {messages.map((m, i) => {
            const isMe = m.user === username;
            return (
              <div
                key={i}
                className={`message ${isMe ? "self" : "other"}`}
              >
                <div className="message-text">
                  {/* <b>{m.user}:</b> */}
                   {m.text}</div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="chat-footer">
          <input
            placeholder='Enter text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
