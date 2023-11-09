import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as io from "socket.io-client";

const Join = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (userName.trim() !== "") {
      e.preventDefault();
      const socket = await io.connect("server-lime-three.vercel.app:80");
      socket.emit("Nome", userName);

      alert(`Usuário ${userName} logado...`);
      document.title = `Chat ${userName}`;
      setLoading(true);
      window.setTimeout(() => navigate("/chat", { state: { userName } }), 3000);
    } else {
      alert("Digite Algo");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-300 font-serif">
      <div className="w-[400px] h-[240px] mx-auto bg-white p-8 rounded-lg shadow-2xl">
        {loading ? (
          <div className="flex flex-col h-[150px] justify-center align-middle items-center text-center ">
            <div className=" w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin m-auto"></div>
            <p className="mt-2 font-mono font-bold">Logando...</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-4">Join</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <input
                className="p-3 w-full mb-4 border rounded outline-none placeholder:text-[15px]"
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                onKeyDown={handleKeyDown}
                name="username"
                placeholder="Enter your username"
              />
              <button
                className="p-3 w-36 rounded-full bg-green-300 hover:bg-green-200"
                type="submit"
              >
                Join
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Join;
