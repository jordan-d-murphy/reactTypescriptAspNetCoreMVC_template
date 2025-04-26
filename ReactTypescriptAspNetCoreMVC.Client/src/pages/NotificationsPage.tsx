import { useEffect, useState } from "react";

type Notification = {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        var notifications = res.json();

        console.log("notifications:");
        console.log(notifications);

        return notifications;
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
