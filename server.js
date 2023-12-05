const path = require("path");

// const Redis = require("ioredis");
// const client = new Redis();

const Redis = require("redis");
const client = Redis.createClient({
  legacyMode: true,
  PORT: 6379,
});

////
const addMessage = (msg) => {
  const { user, message } = msg;
  client.rpush("chatroom", `${user}:${message}`, (err, result) => {
    if (err) console.error(err);
    else console.log(result);
  });
};
// ///////

const createUser = (user) => {
  const { name } = user;

  client.rpush(`users`, `${name}`, (err, result) => {
    if (err) console.error(err);
    else console.log(result);
  });
};

//////
client.connect().catch(console.error);
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// const { createUser, addMessage, getUsers, getMessages } = require("./data");

// const { get } = require("http");

const packageDef = protoLoader.loadSync(
  path.resolve(__dirname, "./chat.proto")
);

const grpcObject = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObject.chatpackage;

function main() {
  const server = getServer();
  server.bindAsync(
    "0.0.0.0:9090",
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Server running at http://localhost:9090");
      server.start();
    }
  );
}

let jl = [];
const jk = async () => {
  await client.lrange("chatroom", 0, -1, (err, result) => {
    if (err) console.error(err);
    else {
      jl = result;
    }
    console.log(jl);
  });
  console.log(jl);
};
jk();

const getMessagesPromiseresolver = async () => {
  // const messages = await getMessages();
  // return messages;
};

// createUser({ username: "joe" });

// const Users = [];
const socket = [];

const joinChat = (call, callback) => {
  const user = call.request;

  console.log(user);

  client.lrange("users", 0, -1, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Hi1");

    if (result.includes(user.name)) {
      callback(null, { res: "User already exists", messages: [] });
    } else {
      createUser(user);

      client.lrange("chatroom", 0, -1, (err, messagesResult) => {
        if (err) {
          console.error(err);
          return;
        }

        // Assuming each message in the "chatroom" list is a string
        const messages = messagesResult.map((messageText, index) => {
          // Create a ChatMessage object for each message
          const [user, message] = messageText.split(":");
          return { message, user };
        });

        callback(null, { res: "User joined", messages: messages });
      });
    }
  });
};

const sendChat = (call, callback) => {
  const chat = call.request;
  console.log(chat);
  addMessage(chat);

  socket.forEach((s) => {
    s.call.write(chat);
  });
  callback(null, {});
};

const recieveChat = (call, callback) => {
  // console.log(call);
  socket.push({ call });
  // console.log(socket);
};
const getServer = () => {
  const server = new grpc.Server();
  server.addService(chatPackage.Chat.service, {
    // Yoho: (req, res) => {
    //   console.log("Hi");
    //   res(null, { message: "Hello from the server" });
    // },
    joinChat,
    sendChat,
    recieveChat,
  });

  return server;
};

main();
