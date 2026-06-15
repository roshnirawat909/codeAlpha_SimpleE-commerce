import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <div className="label">Email</div>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </div>
        <div>
          <div className="label">Password</div>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
        <div className="small">
          No account? <Link to="/register" style={{ color: 'var(--brand)' }}>Register</Link>
        </div>
      </form>
      {error ? <div className="toast err">{error}</div> : null}
    </div>
  );
}

export default Login;
