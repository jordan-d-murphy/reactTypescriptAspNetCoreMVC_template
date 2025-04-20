import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    apiFetch('/api/tools/timestamp')
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.text();
      })
      .then(setTimestamp)
      .catch(err => {
        console.error("Error fetching Timestamp:", err);
        setTimestamp("Unauthorized or error");
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Server Timestamp</h2>
      <p>{timestamp}</p>
    </div>
  );
}