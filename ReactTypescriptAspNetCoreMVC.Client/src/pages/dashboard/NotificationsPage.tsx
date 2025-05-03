import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

type Notification = {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api
      .get("/notifications/me")
      .then((res) => {
        console.log("res.data:");
        console.log(res.data);
        return res.data;
      })
      .then(setNotifications)
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            {n.message} <br />
            <small>{new Date(n.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
