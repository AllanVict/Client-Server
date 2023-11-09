import { useRoutes } from "react-router-dom";

import Chat from "../Components/Chat/Chat";
import Join from "../Components/Join/Join";

export const MainRouter = () => {
  return useRoutes([
    { path: "/", element: <Join /> },
    { path: "/chat", element: <Chat /> },
  ]);
};
