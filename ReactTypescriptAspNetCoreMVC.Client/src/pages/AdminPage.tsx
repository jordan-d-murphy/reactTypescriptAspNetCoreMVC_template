import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function AdminPage() {
  const { isAuthenticated, token, roles } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !roles.includes("Admin")) {
      navigate("/NotFound");
      return;
    }

    fetch("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Access denied");
        return res.text(); // because the endpoint returns a plain string
      })
      .then(setMessage)
      .catch((err) => {
        console.error("Error loading admin data:", err);
        setMessage("Failed to load admin content.");
      });
  }, [isAuthenticated, roles, token, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}
