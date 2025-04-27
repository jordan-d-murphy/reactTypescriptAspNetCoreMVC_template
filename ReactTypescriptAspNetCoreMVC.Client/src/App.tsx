import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import UuidPage from "./pages/UuidPage";
import TimestampPage from "./pages/TimestampPage";
import RandomNumberPage from "./pages/RandomNumberPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Nav } from "./components/Nav";
import NotFoundPage from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./auth/useAuth";
import "react-toastify/dist/ReactToastify.css";
import NavigateSetter from "./NavigateSetter";

function App() {
  const { token, isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connect = async () => {
      if (!isAuthenticated || !token) {
        console.log("User not authenticated yet — skipping SignalR connection.");
        return;
      }

      const newConnection = new signalR.HubConnectionBuilder()
        // should probably load this from config ↓
        .withUrl("http://localhost:5197/hubs/notifications", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        console.log("SignalR Connection State after start:", newConnection.state);
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
        <Nav />
        <Routes>
          <Route path="/" element={<h1>Welcome to the Tools App</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/uuid"
            element={
              <ProtectedRoute>
                <UuidPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timestamp"
            element={
              <ProtectedRoute>
                <TimestampPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/random"
            element={
              <ProtectedRoute>
                <RandomNumberPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
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

      <div>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
