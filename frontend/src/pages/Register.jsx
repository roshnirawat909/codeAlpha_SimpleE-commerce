import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await register({ name, email, password });
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
      <h1 style={{ marginTop: 0 }}>Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <div className="label">Name (optional)</div>
          <input value={name} onChange={(event) => setName(event.target.value)} type="text" />
        </div>
        <div>
          <div className="label">Email</div>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </div>
        <div>
          <div className="label">Password</div>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </div>
        <button className="btn btn-primary" type="submit">Create account</button>
        <div className="small">
          Already have an account? <Link to="/login" style={{ color: 'var(--brand)' }}>Login</Link>
        </div>
      </form>
      {error ? <div className="toast err">{error}</div> : null}
    </div>
  );
}

export default Register;
