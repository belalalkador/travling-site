import Header from "../Sections/Header";
import Footer from "../Sections/Footer";
import { useSocket } from "../Context/Socket";
import { useUser } from "../Context/Context";
import { useEffect } from "react";

export const Layout = ({ children }) => {
  const socket = useSocket();
  const { setNotifications } = useUser();

   useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log("🔔 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, setNotifications]);

  return (
    <div className="flex flex-col w-full min-h-screen overflow-auto">
      <Header />
      <main className="flex-1 flex-grow w-full h-full ">
        {children}
      </main>
      <Footer />
    </div>
  );
};
