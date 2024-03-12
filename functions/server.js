const express = require("express");
const app = express();
const port = process.env.PORT || 8080; // Use a different port from your Next.js application
const socketIO = require("socket.io");
const http = require("http");
const { nanoid } = require("nanoid");
const cors = require("cors");

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
// app.get("/negotiate", (req, res) => {
//   const userID = nanoid(4);
//   io.on("connection", (socket) => {
//     console.log(`User ${userID} sent connection request.`);
//     socket.on("disconnect", () => {
//       console.log("user disconnected");
//     });
//   });
//   res.send("Hello, this is the backend server!");
// });
//
// app.put("/send-message", (req, res) => {});

io.on("connection", (socket) => {
  console.log(`A new user connected`);
  socket.on("update", (update) => {
    // Broadcast the update to all other connected clients
    console.log("Received an update: ", update);
    socket.broadcast.emit("update", update);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

let lastAcceptedRequestTime = 0;
const requestInterval = 35;

app.get("/check-conflicts", (req, res) => {
  const now = new Date().getTime();
  console.log(
    "Time interval:",
    now - lastAcceptedRequestTime,
    "Request: ",
    now - lastAcceptedRequestTime < requestInterval,
  );
  if (now - lastAcceptedRequestTime < requestInterval) {
    return res
      .status(200)
      .json({ result: false, message: "Too many requests" });
  }
  lastAcceptedRequestTime = now;
  return res.status(200).json({ result: true, message: "Accepted request." });
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
