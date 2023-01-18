import * as redis from "redis";
const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("connect", () => {
  console.log("Client connected to redis...");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use ");
});

client.on("error", (err) => {
  console.log(err);
});

client.on("end", () => {
  console.log("client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});
export default client;
