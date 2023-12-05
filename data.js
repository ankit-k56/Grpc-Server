const Redis = require("redis");
const client = Redis.createClient({
  legacyMode: true,
  PORT: 6379,
});
client.connect().catch(console.error);

const createUser = (user) => {
  const { name } = user;

  client.rpush(`users`, `${name}`, (err, result) => {
    if (err) console.error(err);
    else console.log(result);
  });
};

const addMessage = (msg) => {
  const { user, message } = msg;
  client.rpush("chatroom", `${user}:${message}`, (err, result) => {
    if (err) console.error(err);
    else console.log(result);
  });
};

const getUsers = async () => {
  try {
    const result = await client.lRange("users", 0, -1);
    console.log(result);
    // return result;
  } catch (err) {
    console.error(err);
  }
};
const getMessages = async () => {
  try {
    const result = await client.lRange("chatroom", 0, -1);
    console.log(result);
    // return result;
  } catch (err) {
    console.error(err);
  }
};
module.exports = { createUser, addMessage, getUsers, getMessages };
