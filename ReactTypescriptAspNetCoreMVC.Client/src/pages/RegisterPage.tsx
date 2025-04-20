import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert('Account created! Please log in.');
      navigate('/login');
    } else {
      const error = await res.json();
      alert('Registration failed: ' + JSON.stringify(error));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}