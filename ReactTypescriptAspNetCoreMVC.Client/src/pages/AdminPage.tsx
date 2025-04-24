import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type AppUser = {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  fullName: string | null;
  isAdmin: boolean;
};

export function AdminPage() {
  const { isAuthenticated, token, roles } = useAuth();
  const [mapUsersToRoles, setMapUsersToRoles] = useState<Record<string, AppUser[]>>({});
  const [loading, setLoading] = useState(true);
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
        var payload = res.json();
        console.log("res.json() payload");
        console.log(payload);
        return payload;
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        setMapUsersToRoles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin data:", err);
        setLoading(false);
      });
  }, [isAuthenticated, roles, token, navigate]);

  if (loading) return <p>Loading...</p>;
  if (!mapUsersToRoles) return <p>Unable to load Admin Dashboard.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>

      <h3>Users in Roles</h3>
      <ul style={{ textAlign: "left" }}>
        {Object.entries(mapUsersToRoles).map(([role, users]) => (
          <div key={role}>
            <li className="">
              <strong>
                {users.length} {users.length === 1 ? "user" : "users"} with {role} role.
              </strong>
            </li>
            <ul>
              {users.map((user, i) => (
                <li key={i}>{user.fullName}</li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}
