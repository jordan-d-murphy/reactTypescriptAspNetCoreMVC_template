export interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

export enum AuthAction {
  Login = "login",
  Register = "register",
}

export interface LoginV2PageProps {
  tab: AuthAction;
  setTab: React.Dispatch<React.SetStateAction<AuthAction>>;
}
