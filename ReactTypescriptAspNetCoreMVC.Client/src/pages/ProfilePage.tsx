import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, [isAuthenticated, navigate]);

  if (loading) return <p>Loading...</p>;

  if (!profile) return <p>Unable to load profile.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Profile</h2>
      <p>
        <strong>Username:</strong> {profile.userName}
      </p>
      <p>
        <strong>Display Name:</strong> {profile.displayName}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>First Name:</strong> {profile.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {profile.lastName}
      </p>
      <p>
        <strong>Admin:</strong> {profile.isAdmin ? "Yes" : "No"}
      </p>
    </div>
  );
}
