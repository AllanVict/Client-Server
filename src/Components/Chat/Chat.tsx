import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
  type List = {
    author: string;
    text: string;
    authorId: string;
  };

  const [userMessage, setUserMessage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userList, setUserList] = useState<List[]>([]);

  const location = useLocation();
  const username = location.state ? location.state.userName : null;

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserName(username);
    const socket = io("http://localhost:80");
    socket.on("receive_message", (data) => {
      setUserList((current) => [...current, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [username]);

  // Rolar para a parte inferior sempre que a lista de mensagens for atualizada
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [userList]);

  const handleSendMessage = async () => {
    const socket = await io("http://localhost:80");
    if (!userMessage.trim()) return;

    socket.emit("message", { userName, userMessage });

    setUserMessage("");
  };

  return (
    <div className="flex flex-col items-center align-middle h-screen bg-slate-300 font-serif overflow-hidden">
      <h1 className="text-3xl font-bold text-center mb-4 fixed top-0">Chat</h1>
      <div
        ref={messagesRef}
        className=" relative h-[700px]  top-[90px] w-[600px] p-4 rounded-lg  overflow-y-auto"
      >
        {userList.map((user, index) => (
          <div
            key={index}
            className={`flex ${
              user.author === userName ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex h-auto bg-blue-300 mb-2 rounded-xl">
              <p
                className={`flex relative mr-3 p-1 ${
                  user.author === userName ? "text-blue-600" : "text-red-600"
                } font-semibold pr-2`}
              >
                {user.author}
              </p>
              <p
                className={`relative mt-3 ml-[-2px] ${
                  user.author === userName ? "bg-blue-200" : "bg-red-200"
                } p-2 rounded-md inline-block max-w-[80%]`}
              >
                {user.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-[750px] fixed bottom-0">
        <input
          className="p-3 w-full mb-4 border rounded outline-none placeholder:text-[15px]"
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) =>
            e.key === "Enter" ? handleSendMessage() : null
          }
          value={userMessage}
          type="text"
          name="mensagem"
          placeholder="Mensagem"
        />

        <button
          className="flex h-[45px] items-center relative ml-[-35px]"
          onClick={handleSendMessage}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Chat;
