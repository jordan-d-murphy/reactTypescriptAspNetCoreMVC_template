import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";

interface RegisterForm {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  colorRole: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    displayName: "",
    colorRole: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/register", form);
      if (response.data.success) {
        navigate("/login");
      } else {
        setError("Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Register</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
        />
        <br />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
        />
        <br />

        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={form.displayName}
          onChange={handleChange}
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
        />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
        />
        <br />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          autoComplete="off"
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          autoComplete="new-password"
        />
        <br />

        <fieldset>
          <legend>Choose a Color Role:</legend>
          <div>
            <input
              type="radio"
              name="colorRole"
              id="radio-red"
              value="Red"
              defaultChecked={false}
              onChange={handleChange}
            />
            <label htmlFor="radio-red">Red</label>
          </div>
          <div>
            <input
              type="radio"
              name="colorRole"
              id="radio-green"
              value="Green"
              defaultChecked={false}
              onChange={handleChange}
            />
            <label htmlFor="radio-green">Green</label>
          </div>
          <div>
            <input
              type="radio"
              name="colorRole"
              id="radio-blue"
              value="Blue"
              defaultChecked={false}
              onChange={handleChange}
            />
            <label htmlFor="radio-blue">Blue</label>
          </div>
        </fieldset>

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
