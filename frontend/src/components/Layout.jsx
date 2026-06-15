import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';

function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <Link to="/">🛍️ Shop</Link>
        </div>
        <nav className="nav">
          <Link to="/cart" className="nav-link">
            Cart {totalItems > 0 ? <span className="muted">({totalItems})</span> : null}
          </Link>
          {isAuthenticated ? (
            <button type="button" className="nav-link btn-link" onClick={logout}>
              Logout {user?.name || user?.email}
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </header>
      <main className="container">{children}</main>
    </>
  );
}

export default Layout;
