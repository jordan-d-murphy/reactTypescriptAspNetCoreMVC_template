import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function RandomNumberPage() {
  const [number, setNumber] = useState<number | string>("");

  useEffect(() => {
    api
      .get("/tools/random")
      .then((res) => {
        return res.data;
      })
      .then(setNumber)
      .catch((err) => {
        console.error("Error fetching Timestamp:", err);
        setNumber("Unauthorized or error");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Random Number (1–100)</h2>
      <p>{number}</p>
    </div>
  );
}
