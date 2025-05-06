import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
// import { RegisterForm } from "./types";

export function RegisterV2Page({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  // const [form, setRegisterForm] = useState<RegisterForm>({
  //   username: "",
  //   password: "",
  //   email: "",
  // });

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/register", {
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
      });
      if (response.data.success) {
        onRegisterSuccess();
      } else {
        setError("Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="off"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-username">Username</Label>
          <Input
            id="register-username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            placeholder="name123"
            autoComplete="off"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="register-password">Password</Label>
          </div>
          <Input
            id="register-password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <Button type="submit" onClick={handleRegister} className="w-full">
          Register
        </Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
