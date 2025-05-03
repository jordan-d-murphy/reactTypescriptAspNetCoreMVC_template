import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import api from "../../api/axiosInstance";
import Modal from "../../components/Modal";

interface NotifyAllForm {
  message: string;
}

type AppUser = {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  userName: string | null;
  fullName: string | null;
  isAdmin: boolean;
};

export default function AdminPage() {
  const { isAuthenticated, token, roles } = useAuth();
  const [mapUsersToRoles, setMapUsersToRoles] = useState<Record<string, AppUser[]>>({});
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { user: userName } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NotifyAllForm>({
    message: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !roles.includes("Admin")) {
      navigate("/NotFound");
      return;
    }

    api
      .get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        setMapUsersToRoles(data.mapUsersToRoles);
        setAllUsers(data.allUsers);
        setLoading(false);
        return data;
      })
      .then((data) => {
        setMapUsersToRoles(data.mapUsersToRoles);
        setAllUsers(data.allUsers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin data:", err);
        setLoading(false);
      });
  }, [isAuthenticated, roles, token, navigate]);

  const handleRoleToggle = async (username: string, role: string, isCurrentlyInRole: boolean) => {
    try {
      const { data } = await api({
        url: "/admin/roles",
        method: isCurrentlyInRole ? "delete" : "post",
        data: { username, role },
      });

      setMapUsersToRoles(data.mapUsersToRoles);
    } catch (err) {
      console.error("Role update failed", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNotifyAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/admin/notifyall", { message: form.message });
      console.log(res.data);
      setForm({ message: "" });
    } catch (err) {
      console.error("Notify all failed", err);
      setError("Something went wrong trying to notify all users. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>

      <p>Send a test notification to all users.</p>
      <form autoComplete="off" onSubmit={handleNotifyAll}>
        <input
          type="text"
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
        />
        <br />

        <button type="submit">Notify All</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Users in Roles</h3>
      {selectedRole && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2>Edit User Roles</h2>
          <form>
            <strong>Edit users for role: {selectedRole}</strong>
            <ul>
              {allUsers.map((user) => {
                const isInRole = mapUsersToRoles[selectedRole]?.some((u) => u.userName === user.userName);
                return (
                  <li key={user.userName}>
                    <label>
                      <input
                        type="checkbox"
                        checked={isInRole}
                        disabled={user.userName === userName && selectedRole === "Admin" && isInRole}
                        onChange={() => handleRoleToggle(user.userName!, selectedRole, isInRole)}
                      />
                      {user.fullName}
                    </label>
                  </li>
                );
              })}
            </ul>
          </form>
        </Modal>
      )}
      <ul style={{ textAlign: "left" }}>
        {mapUsersToRoles && Object.keys(mapUsersToRoles).length > 0 ? (
          Object.entries(mapUsersToRoles).map(([role, usersInRole]) => (
            <div key={role}>
              <li style={{ position: "relative" }}>
                <strong>
                  {usersInRole.length} {usersInRole.length === 1 ? "user" : "users"} with {role} role.
                </strong>
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setModalOpen(true);
                  }}
                >
                  Edit Roles
                </button>
              </li>
              <ul>
                {usersInRole.map((user) => (
                  <li key={user.userName}>{user.fullName}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No role data found.</p>
        )}
      </ul>
    </div>
  );
}
