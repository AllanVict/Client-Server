import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as io from "socket.io-client";

const Join = () => {
  const [userName, setUserName] = useState<String>("");
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (userName.trim() !== "") {
      e.preventDefault();
      const socket = await io.connect("http://localhost:80");
      socket.emit("Nome", userName);

      alert(`Usuário ${userName} logado...`);
      document.title = `Chat ${userName}`;
      navigate("/chat", { state: { userName } });
    } else {
      alert("Digite Algo");
    }
  };
  return (
    <>
      <h1>Join</h1>
      <form action="chat.tsx" method="post">
        <input
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          onKeyDown={handleKeyDown}
          name="username"
          placeholder="Digitar nome de usuário"
        />
        <button type="submit" onClick={handleSubmit}>
          Entrar
        </button>
      </form>
    </>
  );
};

export default Join;
