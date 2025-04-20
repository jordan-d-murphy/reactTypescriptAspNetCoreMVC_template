import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function RandomNumberPage() {
  const [number, setNumber] = useState<number | string>("");

  useEffect(() => {
    apiFetch('/api/tools/random')
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.text();
      })
      .then(setNumber)
      .catch(err => {
        console.error("Error fetching Timestamp:", err);
        setNumber("Unauthorized or error");
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Random Number (1–100)</h2>
      <p>{number}</p>
    </div>
  );
}