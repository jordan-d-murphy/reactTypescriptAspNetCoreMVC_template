import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function UuidPage() {
  const [uuid, setUuid] = useState<string>("");

  useEffect(() => {
    api
      .get("/tools/uuid")
      .then((res) => res.data)
      .then(setUuid)
      .catch((err) => {
        console.error("Error fetching UUID:", err);
        setUuid("Unauthorized or error");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>UUID Generator</h2>
      <p>{uuid}</p>
    </div>
  );
}
