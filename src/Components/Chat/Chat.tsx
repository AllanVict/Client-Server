import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import io from "socket.io-client"; // Importe 'io' em vez de '* as io'

const Chat = () => {
  type List = {
    author: string;
    text: string;
    authorId: string;
  };
  type Name = {
    name: string;
  };

  const [userMessage, setUserMessage] = useState<string>();
  const [userName, setUserName] = useState<Name[]>([]);
  const [userList, setUserList] = useState<List[]>([]);

  const location = useLocation(); // Obtenha a localização atual para acessar o estado passado
  const username = location.state ? location.state.userName : null;

  // Crie a instância do Socket.IO fora do componente

  useEffect(() => {
    // Configure o ouvinte para receber mensagens
    setUserName(username);
    const socket = io("http://localhost:80");
    socket.on("receive_message", (data) => {
      setUserList((current) => [...current, data]);
    });

    // Remova o ouvinte quando o componente é desmontado
    return () => {
      socket.off("receive_message");
    };
  }, []);
  const handleSendMessage = async () => {
    // Emita a mensagem na instância existente do Socket.IO
    const socket = await io("http://localhost:80");
    if (!userMessage?.trim()) return;

    socket.emit("message", { userName, userMessage });

    // Limpe a mensagem após enviá-la
    setUserMessage("");
  };

  return (
    <>
      <h1>Chat</h1>
      <input
        onChange={(e) => setUserMessage(e.target.value)}
        value={userMessage} // Use 'value' para vincular o estado do input
        type="text"
        name="mensagem"
        placeholder="Mensagem"
      />
      <div>
        {userList.map((user, index) => (
          <p key={index}>
            {user.author}:{user.text}
          </p>
        ))}
      </div>
      <button
        onClick={() => {
          handleSendMessage();
        }}
      >
        Enviar
      </button>
      <Link to="/join">Voltar</Link>
    </>
  );
};

export default Chat;
