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
      console.log("Server running at http://locaclhost:8000");
      server.start();
    }
  );
}

const getServer = () => {
  const server = new grpc.Server();
  server.addService(chatPackage.Chat.service, {
    Yoho: (req, res) => {
      console.log("Hi");
      res(null, { message: "Hello from the server" });
    },
  });

  return server;
};

main();
