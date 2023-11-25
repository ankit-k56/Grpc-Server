// App.js
import React, { useState, useEffect } from "react";
import { ChatClient } from "./proto/chat_grpc_web_pb";
import { Yohorequest } from "./proto/chat_pb";

// import "./App.css"; // Remove this line

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const client = new ChatClient("http://localhost:8080");
    const req = new Yohorequest();
    req.setMessage("Hello from React");
    client.yoho(req, {}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res.getMessage());
      }
    });
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen  w-[100vw] bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md">
        <div className="h-64 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            className="flex-1 mr-2 p-2 rounded border border-gray-300"
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
