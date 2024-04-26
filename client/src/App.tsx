import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState("");
  
  return (
    <main>
      {user === "" ? (
        <Login setUser={setUser} />
      ): (
        <>
          <Header />
          <Chat user={user}/>
        </>
      )}
    </main>
  );
}

export default App;
