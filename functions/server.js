const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const { WebPubSubServiceClient } = require("@azure/web-pubsub");
const { nanoid } = require("nanoid");
const cors = require("cors");

const connectionString =
  "Endpoint=https://voop-socket-test.webpubsub.azure.com;AccessKey=XBj9LaNaLsfLywuaKFpKeL8OMbrUsx+zBGAw17DBNAw=;Version=1.0;";
const hubName = "TestHub";
const pubsub = new WebPubSubServiceClient(connectionString, hubName);

app.use(express.json());
app.use(cors());

app.get("/negotiate", async (req, res) => {
  console.log(`A new user connected`);
  const userID = nanoid(4);
  const token = await pubsub.getClientAccessToken({
    userId: userID,
    roles: ["webpubsub.sendToAll"],
  });
  // console.log("Returning url:", token.url);
  return res.status(200).json({ url: token.url, userId: userID });
});

app.put("/send-message", async (req, res) => {
  // console.log("Received from user: ", req.body);
  console.log("Received from user");
  pubsub.sendToAll(req.body, { contentType: "application/json" });
  // pubsub.sendToAll("Hi there");
  // pubsub.sendToAll("Hi there", { contentType: "text/plain" });
  res.json({ message: "Received." });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
