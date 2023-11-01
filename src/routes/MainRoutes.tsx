import { useRoutes } from "react-router-dom";

import Chat from "../Components/Chat/Chat";
import Join from "../Components/Join/Join";

export const MainRouter = () => {
  return useRoutes([
    { path: "/chat", element: <Chat /> },
    { path: "/join", element: <Join /> },
  ]);
};
