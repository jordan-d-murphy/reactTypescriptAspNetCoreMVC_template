import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    api
      .get("/tools/timestamp")
      .then((res) => res.data)
      .then(setTimestamp)
      .catch((err) => {
        console.error("Error fetching Timestamp:", err);
        setTimestamp("Unauthorized or error");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Server Timestamp</h2>
      <p>{timestamp}</p>
    </div>
  );
}
