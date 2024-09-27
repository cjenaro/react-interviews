import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Server } from "socket.io";

type User = {
  username: string;
  password: string;
};

type Message = {
  user: User;
  message: string;
  timestamp: string;
};

const users: User[] = [];
const messages: Message[] = [];
const userSockets: { [key: string]: User } = {};

const app = new Hono();
app.get("/", (c) => c.text("Hi :)"));
app.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    return c.json({ message: "user not found" }, 404);
  }

  return c.json(user, 200);
});

app.post("/register", async (c) => {
  const { username, password, passwordConfirmation } = await c.req.json();
  if (!username || !password || password !== passwordConfirmation) {
    return c.json({ message: "Malformed request" }, 400);
  }

  const user = {
    username,
    password,
  };

  users.push(user);
  return c.json(user, 200);
});

const server = serve({
  ...app,
  port: 1234,
});
console.log("Serving on http://localhost:1234");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send existing messages to the newly connected user
  socket.emit("chat history", messages);

  // Handle user joining
  socket.on("user joined", (username) => {
    userSockets[socket.id] = users.find((u) => u.username === username)!;
    io.emit("user list", Object.values(userSockets));
  });

  // Handle incoming messages
  socket.on("chat message", (msg) => {
    const messageData = {
      user: userSockets[socket.id],
      message: msg,
      timestamp: new Date().toISOString(),
    };
    messages.push(messageData);

    // Broadcast the message to all clients
    io.emit("chat message", messageData);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete userSockets[socket.id];
    io.emit("user list", Object.values(userSockets));
  });
});
