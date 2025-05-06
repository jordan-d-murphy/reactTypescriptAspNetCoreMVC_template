import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import api from "@/api/axiosInstance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

enum AuthAction {
  Login = "login",
  Register = "register",
}

export default function AuthV2({ className, ...props }: React.ComponentProps<"div">) {
  const [tab, setTab] = useState<AuthAction>(AuthAction.Login);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loginMessage) {
      const timeout = setTimeout(() => setLoginMessage(null), 8000);
      return () => clearTimeout(timeout);
    }
  }, [loginMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className={cn("flex flex-col gap-6 p-10", className)} {...props}>
        <Tabs value={tab} onValueChange={(val) => setTab(val as AuthAction)} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>{loginMessage ?? "Please enter your credentials."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form id="login-form">
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                            fill="currentColor"
                          />
                        </svg>
                        Login with Apple
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Login with Google
                      </Button>
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                    <LoginV2Page />
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <a onClick={() => setTab(AuthAction.Register)} className="underline underline-offset-4">
                        Register
                      </a>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form id="register-form" autoComplete="off">
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                            fill="currentColor"
                          />
                        </svg>
                        Continue with Apple
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                    <RegisterV2Page
                      onRegisterSuccess={() => {
                        setLoginMessage("Account created successfully. Please log in.");
                        setTab(AuthAction.Login);
                      }}
                    />{" "}
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <a onClick={() => setTab(AuthAction.Login)} className="underline underline-offset-4">
                        Log In
                      </a>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function LoginV2Page() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email: loginEmail, password: loginPassword });

      if (response.data?.token) {
        login(response.data.token);
        navigate("/app");
      } else {
        console.error("Token missing in response:", response.data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="login-password">Password</Label>
          <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </a>
        </div>
        <Input
          id="login-password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          type="password"
          required
        />
      </div>
      <Button type="submit" onClick={handleLogin} className="w-full">
        Login
      </Button>
    </div>
  );
}

export function RegisterV2Page({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const [form, setRegisterForm] = useState<RegisterForm>({
    username: "",
    password: "",
    email: "",
  });

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
