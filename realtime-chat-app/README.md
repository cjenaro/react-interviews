# Description

Build a simple real-time chat application using React.
The app should allow multiple users to join a chat room, send messages, and see messages from others instantly.

## Requirements

- User Authentication: Implement a basic authentication flow (e.g., login with a username and password).
- Chat Room: Users join a common chat room upon logging in.
- Real-Time Messaging: Messages are sent and received in real-time.
- Message History: Display a scrollable chat history with timestamps.
- Online Users List: Show a list of currently online users.
- Input Validation: Prevent empty messages from being sent.

## Guidelines

- Use WebSockets for real-time communication.
- Focus on functionality over design, but ensure the UI is intuitive.
- Keep the code clean and well-commented.

### server

Server is created in the server.ts file, serve with npm run dev:server.

routes:

- /login - responds with a user
- /register - responds with a user
- ws connection with Socket.io

## Bonus Points

- Multiple Chat Rooms: Allow users to create and join different chat rooms.
- Typing Indicators: Show when a user is typing.
- Message Reactions: Enable users to add reactions to messages.
