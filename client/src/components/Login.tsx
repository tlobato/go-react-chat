import { FormEvent, useState } from "react";

type Props = {
    setUser: React.Dispatch<React.SetStateAction<string>>
}

export default function Login({ setUser }: Props) {
    const [input, setInput] = useState("")

  const handleLogin = (ev: FormEvent) => {
    ev.preventDefault()
    setUser(input)
  };

  return (
    <div className="w-full h-screen bg-zinc-950 flex flex-col pt-80 items-center gap-6">
      <h1 className="text-3xl font-semibold">go-react-chat</h1>
      <form onSubmit={handleLogin} className="flex flex-col w-80 gap-2">
        <input
          type="text"
          onChange={(ev) => setInput(ev.target.value)}
          value={input}
          placeholder="Your name"
          className="text-lg px-4 py-2 rounded-xl focus:ring-1 ring-white bg-zinc-900"
        />
        <button className="bg-zinc-900 py-2 rounded-xl text-xl self-end focus:ring-1 ring-white px-4">
          Enter chat
        </button>
      </form>
    </div>
  );
}
