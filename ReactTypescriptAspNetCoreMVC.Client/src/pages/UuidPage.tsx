import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function UuidPage() {
  const [uuid, setUuid] = useState<string>("");

  useEffect(() => {
    apiFetch('/api/tools/uuid')
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.text();
      })
      .then(setUuid)
      .catch(err => {
        console.error("Error fetching UUID:", err);
        setUuid("Unauthorized or error");
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>UUID Generator</h2>
      <p>{uuid}</p>
    </div>
  );
}