import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    api
      .get("/users/me")
      .then((res) => res.data)
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
    <div style={{ padding: "2rem", textAlign: "left" }}>
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

      <h3>User Roles</h3>
      <ul>
        {profile.roles?.map((role: string, i: number) => (
          <li key={i}>{role}</li>
        ))}
      </ul>

      <h3>JWT Claims</h3>
      <ul>
        {profile.claims?.map((claim: any, i: number) => (
          <li key={i}>
            <strong>{claim.type}:</strong> {claim.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
