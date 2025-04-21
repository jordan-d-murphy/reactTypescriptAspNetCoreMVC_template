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

type Forecast = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Forecast[]>([]);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <>
      <Router>
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
            path="*"
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
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

      <div style={{ padding: "2rem" }}>
        <h1>Weather Forecast</h1>
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp (°C)</th>
              <th>Temp (°F)</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((f, i) => (
              <tr key={i}>
                <td>{f.date}</td>
                <td>{f.temperatureC}</td>
                <td>{f.temperatureF}</td>
                <td>{f.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
