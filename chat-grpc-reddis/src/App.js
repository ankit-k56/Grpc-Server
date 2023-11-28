// App.js
import React, { useState, useEffect } from "react";
import { ChatClient } from "./proto/chat_grpc_web_pb";
import { ChatMessage, User, Nil } from "./proto/chat_pb";

import "./App.css";

let client = new ChatClient("http://localhost:8080");
const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("Ankit");
  const [joined, setJoined] = useState(true);

  useEffect(() => {
    // client = new ChatClient("http://localhost:8080");
    // const req = new Yohorequest();
    // req.setMessage("Hello from React");
    // client.yoho(req, {}, (err, res) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(res.getMessage());
    //   }
    // });
    const empty = new Nil();
    const chatStream = client.recieveChat(empty, {});
    chatStream.on("data", (res) => {
      const from = res.getUser();
      const msg = res.getMessage();

      setMessages([...messages, { text: msg, sender: from }]);
      console.log(messages);
    });
    chatStream.on("end", () => {
      console.log("Stream ended.");
    });
  }, []);

  const sendMsg = () => {
    const chat = new ChatMessage();
    chat.setMessage(newMessage);
    chat.setUser(userName);
    client.sendChat(chat, {}, (err, res) => {
      if (err) {
        console.error(err);
      }
      // console.log(res);
      console.log(messages);
    });
  };

  const joinHandler = () => {
    const user = new User();
    user.setName = userName;
    user.setId = userName;
    client.JoinChat(user, {}, (err, res) => {
      if (err) {
        console.error(err);
      }
      const msg = res.getMessage();
      if (msg === "User already exists") {
        alert(msg);
        return;
      }
      setJoined(true);
    });
  };

  const nameHandler = (e) => {
    console.log(userName);
    setUserName(e.target.value);
  };

  const Login = () => {
    return (
      <div>
        <input
          onChange={nameHandler}
          type="text"
          placeholder="Enter your name"
          value={userName}
        />
        <button onClick={joinHandler}>Join Chat</button>
      </div>
    );
  };

  const ChatApp = () => {
    return (
      <div className="App">
        <div className="Chat">
          <div className="Messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`Message ${
                  message.sender === "user" ? "User" : "Bot"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="InputContainer">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMsg}>Send</button>
          </div>
        </div>
      </div>
    );
  };
  return <div className="App">{joined ? <ChatApp /> : <Login />}</div>;
};

export default App;
