import { FormEvent, useEffect, useState } from "react";

type Message = {
  user: string;
  msg: string;
};

export default function Chat({ user }: { user: string }) {
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  console.log(messages);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:3333/ws");

    newSocket.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      const newMessage: Message = data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        const newMessage: Message = data;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
    }
  }, [socket]);

  const handleSubmitMsg = (ev: FormEvent) => {
    ev.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN) {
      const newMessage: Message = {
        user: user,
        msg: input,
      };
      socket.send(JSON.stringify(newMessage));
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ul className="py-4 mt-16 mb-40 flex flex-col gap-2 px-3 md:px-10 overflow-auto">
        {messages.map((msg, i) => (
          <li
            key={i}
            className={`flex flex-col md:max-w-2xl rounded-2xl py-2 px-4 ${
              user === msg.user
                ? "self-end bg-green-400 rounded-tr-none"
                : "self-start bg-blue-400 rounded-tl-none"
            }`}
          >
            {user !== msg.user && <span>{msg.user}</span>}
            <h4 className="text-2xl">{msg.msg}</h4>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmitMsg}
        className="w-full fixed bottom-0 flex flex-col px-3 md:px-10 gap-2 py-2 bg-neutral-900 h-40"
      >
        <span className="self-center">You: {user}</span>
        <input
          type="text"
          placeholder="Message..."
          onChange={(ev) => setInput(ev.target.value)}
          value={input}
          className="text-xl px-4 py-2 rounded-xl focus:ring-1 ring-white bg-zinc-950"
        />
        <button
          disabled={!socket || socket.readyState !== WebSocket.OPEN || input === ""}
          className="bg-zinc-950 py-2 rounded-xl text-lg self-end disabled:bg-neutral-800 focus:ring-1 ring-white px-3"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
