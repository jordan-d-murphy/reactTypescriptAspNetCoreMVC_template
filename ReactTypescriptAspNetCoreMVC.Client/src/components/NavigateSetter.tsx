import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "../router";

export default function NavigateSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null; // this component just sets up navigation
}
