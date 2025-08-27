import { useEffect } from "react";
import { Layout } from "../../Layout/Layout";
import { useUser } from "../../Context/Context";
import { useSocket } from "../../Context/Socket"; // import the socket context
import axios from "axios";
 
function Notifications() {
  const { notifications, setNotifications } = useUser();
  const socket = useSocket(); // get the socket instance

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      console.log("🔔 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("newNotification", handleNewNotification);

    // Cleanup listener on unmount
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, setNotifications]);


// Mark notification as read
const handleMarkRead = async (id) => {
  try {
    const res = await axios.put(
      `http://localhost:3000/user/api/v1/notification/${id}`,
      {}, // PUT body can be empty if your API does not need data
      { withCredentials: true } // ✅ send credentials/cookies
    );

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

// Delete notification
const handleDelete = async (id) => {
  try {
    const res = await axios.delete(
      `http://localhost:3000/user/api/v1/notification/${id}`,
      { withCredentials: true } // ✅ send credentials/cookies
    );

    setNotifications((prev) => prev.filter((n) => n._id !== id));
  } catch (err) {
    console.error("Error deleting notification:", err);
  }
};

  if (!notifications || notifications.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
          <p className="text-lg text-gray-600">No notifications yet</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="max-w-2xl px-4 py-12 mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Notifications</h1>
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex justify-between items-center p-4 rounded-2xl shadow-md transition 
                  ${
                    n.isRead
                      ? "bg-gradient-to-r from-gray-100 to-gray-200"
                      : "bg-gradient-to-r from-blue-50 via-white to-blue-100 border-l-4 border-blue-500"
                  }
                `}
              >
                <p
                  className={`flex-1 text-gray-800 ${
                    n.isRead ? "opacity-70" : "font-medium"
                  }`}
                >
                  {n.message}
                </p>
                <div className="flex gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="px-3 py-1 text-sm text-white transition bg-blue-500 rounded-xl hover:bg-blue-600"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="px-3 py-1 text-sm text-white transition bg-red-500 rounded-xl hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Notifications;
