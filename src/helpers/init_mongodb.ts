import mongoose from "mongoose";

export default class Connection {
  start(): void {
    mongoose
      .connect("mongodb://localhost:27017", { dbName: "auth" })
      .then(() => {
        console.log("Mongodb started.");
      })
      .catch((err) => console.log(err.message));
  }
}
