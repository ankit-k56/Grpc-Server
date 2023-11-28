const path = require("path");

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

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
const Users = [];
const socket = [];

const JoinChat = (call, callback) => {
  const user = call.request;
  if (Users.includes(user.name)) {
    callback(null, { message: "User already exists" });
  }
  callback(null, { message: "User joined" });
};

const sendChat = (call, callback) => {
  const chat = call.request;
  socket.forEach((s) => {
    // console.log(s.call);
    // console.log(chat);
    s.call.write(chat);
  });
  callback(null, {});
};

const recieveChat = (call, callback) => {
  // console.log(call);
  socket.push({ call });
  console.log(socket);
};
const getServer = () => {
  const server = new grpc.Server();
  server.addService(chatPackage.Chat.service, {
    // Yoho: (req, res) => {
    //   console.log("Hi");
    //   res(null, { message: "Hello from the server" });
    // },
    JoinChat,
    sendChat,
    recieveChat,
  });

  return server;
};

main();
