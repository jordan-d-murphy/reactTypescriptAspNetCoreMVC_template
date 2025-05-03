import { useEffect, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import "./App.css";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigateSetter from "@/components/NavigateSetter";
import AxiosErrorListener from "@/api/AxiosErrorListener";
import { routes } from "@/routing/routes";

function RoutesWrapper() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  const { token, isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connect = async () => {
      if (!isAuthenticated || !token) {
        console.log("User not authenticated yet — skipping SignalR connection.");
        return;
      }

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5197/hubs/notifications", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        console.log("SignalR Connected!");
        setConnection(newConnection);

        newConnection.on("ReceiveNotification", (notification) => {
          if (typeof notification === "string") {
            toast.info(notification);
          } else if (notification?.message) {
            toast.info(notification.message);
          } else {
            console.warn("Received unknown notification payload:", notification);
          }
        });
      } catch (error) {
        console.error("SignalR Connection Error: ", error);
      }
    };

    connect();

    return () => {
      connection?.stop();
    };
  }, [token, isAuthenticated]);

  return (
    <>
      <Router>
        <NavigateSetter />
        <AxiosErrorListener />
        <RoutesWrapper />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
