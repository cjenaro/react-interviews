import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:1234", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
});

function ChatMessagesApp({ user }: { user: { username: string } }) {
  const [messages, setMessages] = useState<
    { message: string; timestamp: string; user?: { username: string } }[]
  >([]);
  const [users, setUsers] = useState<{ username: string }[]>([]);

  useEffect(() => {
    socket.connect();
    socket.emit("user joined", user.username);

    socket.on("user list", (u) => {
      setUsers(u);
    });

    socket.on("chat message", (message) => {
      setMessages((m) => [...m, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user.username]);

  function handleMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const message = data.get("message");

    if (!message) return;

    console.log("EMITTING MESSAGE");
    socket.emit("chat message", message);
  }

  return (
    <div>
      <h1>Hi! {user.username} </h1>

      <p>There are {users.length} users online right now</p>

      <form
        onSubmit={handleMessage}
        className="flex gap-4 m-4 p-4 justify-between border-indigo-200 border-solid border-2 rounded-md"
      >
        <input type="text" name="message" placeholder="Write a message..." />
        <button
          type="submit"
          className="text-white p-2 bg-indigo-600 rounded-md"
        >
          Send
        </button>
      </form>

      <ul className="p-4 border-2 mx-4 border-solid border-indigo-200 rounded-md">
        {messages.reverse().map((m) => (
          <li
            key={m.timestamp}
            className="p-2 border-b-2 border-b-indigo-200 border-b-solid last-of-type:border-b-0"
          >
            {m.message} at {m.timestamp} by {m.user?.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

const BACKEND_URL = "http://localhost:1234/";
function LoginForm({
  setUser,
}: {
  setUser: Dispatch<SetStateAction<{ username: string }>>;
}) {
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    const res = await fetch(`${BACKEND_URL}login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      return;
    }

    const user = await res.json();
    setUser(user);
  }
  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const res = await fetch(`${BACKEND_URL}register`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
      }),
    });

    if (!res.ok) {
      return;
    }

    const user = await res.json();
    setUser(user);
  }

  return (
    <div className="p-4 my-10 max-w-screen-md w-full mx-auto border-2 rounded-lg">
      <h2 className="text-2xl mb-2">Log in:</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username:</label>
          <input
            className="p-4  border-2 border-indigo-200 rounded-md"
            id="username"
            name="username"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password:</label>
          <input
            className="p-4 border-2 border-indigo-200 rounded-md"
            id="password"
            name="password"
            type="password"
          />
        </div>
        <button
          type="submit"
          className="p-4 text-white bg-indigo-600 rounded-md"
        >
          log in
        </button>
      </form>
      <hr className="w-full border-2 my-4 border-indigo-600 rounded-md" />
      <h2 className="text-2xl mb-2">Sign up: </h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username:</label>
          <input
            className="p-4  border-2 border-indigo-200 rounded-md"
            id="username"
            name="username"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password:</label>
          <input
            className="p-4 border-2 border-indigo-200 rounded-md"
            id="password"
            name="password"
            type="password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            className="p-4 border-2 border-indigo-200 rounded-md"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
          />
        </div>
        <button
          type="submit"
          className="p-4 text-white bg-indigo-600 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<{ username: string }>({
    username: "",
  });

  const isLoggedIn = !!user.username;

  return isLoggedIn ? (
    <ChatMessagesApp user={user} />
  ) : (
    <LoginForm setUser={setUser} />
  );
}

export default App;
