import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.error) setError(result.error);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>GeekHub</h1>
        <p style={styles.subtitle}>Friendships for Introverted Geeks</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button style={styles.button} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup({ username, email, password });
    if (result.error) setError(result.error);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Join GeekHub</h1>
        <p style={styles.subtitle}>Create your geek profile</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button style={styles.button} type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card: { background: '#1e293b', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '400px' },
  title: { color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: 'none', outline: 'none', background: '#0f172a', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#ff4500', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' },
  error: { color: '#ef4444', fontSize: '0.85rem' }
};
