import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./auth/useAuth";
import { Nav } from "./components/Nav";
import NavigateSetter from "./NavigateSetter";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UuidPage from "./pages/UuidPage";
import TimestampPage from "./pages/TimestampPage";
import RandomNumberPage from "./pages/RandomNumberPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosErrorListener from "./api/AxiosErrorListener";

function App() {
  const { token, isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [count, setCount] = useState(0);

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
        <Nav />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/timestamp" element={<TimestampPage />} />
            <Route path="/uuid" element={<UuidPage />} />
            <Route path="/random" element={<RandomNumberPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="/" element={<h1>Welcome to the Tools App</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>

      <ToastContainer />
    </>
  );
}

export default App;
