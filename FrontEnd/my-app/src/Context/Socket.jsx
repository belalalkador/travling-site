import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./Context";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useUser();
  const userId = user?._id;
console.log(user)
  useEffect(() => {
    console.log(userId)
    if (!userId) return; // ✅ do not connect if userId is missing
     
    // ✅ create socket connection with userId in query
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      query: { userId },
      transports: ["websocket"], // ✅ ensures stable connection
    });

    newSocket.on("connect", () => {
      console.log(`✅ Connected: ${newSocket.id} (user: ${userId})`);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    setSocket(newSocket);

    // ✅ cleanup when component unmounts or userId changes
    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
        console.log("🔌 Disconnected socket");
      }
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// ✅ Hook to use socket anywhere in app
export const useSocket = () => {
  return useContext(SocketContext);
};
