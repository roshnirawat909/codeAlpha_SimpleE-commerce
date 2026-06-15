import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';

function formatPrice(value) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value ?? 0);
}

function Cart() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
      items.map((item) => apiFetch(`/api/fake-products/${item.productId}`))
        );
        if (!active) return;
        const map = Object.fromEntries(results.map((product) => [String(product._id), product]));
        setProducts(map);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (items.length > 0) {
      loadProducts();
    } else {
      setProducts({});
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [items]);

  const cartItems = useMemo(
    () =>
      items
        .map((item) => ({ ...item, product: products[String(item.productId)] }))
        .filter((entry) => entry.product),
    [items, products]
  );

  const total = cartItems.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setToast('Please login to place an order.');
      window.setTimeout(() => navigate('/login'), 900);
      return;
    }

    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: { items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      });
      clearCart();
      setToast('Order placed!');
      window.setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setToast(err.message);
    }
  };

  if (loading) {
    return <div className="page">Loading cart...</div>;
  }

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Cart</h1>
      {error ? <div className="toast err">{error}</div> : null}
      {toast ? <div className="toast ok">{toast}</div> : null}

      {cartItems.length === 0 ? (
        <div className="toast">Your cart is empty.</div>
      ) : (
        <>
          <table className="table" aria-label="Cart items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Line total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((entry) => (
                <tr key={entry.product._id}>
                  <td>{entry.product.name}</td>
                  <td>{formatPrice(entry.product.price)}</td>
                  <td>
                    <div className="qty-row">
                      <button type="button" className="btn" onClick={() => updateQty(entry.product._id, -1)}>-</button>
                      <span className="muted" style={{ minWidth: 42, textAlign: 'center' }}>
                        {entry.quantity}
                      </span>
                      <button type="button" className="btn" onClick={() => updateQty(entry.product._id, 1)}>+</button>
                    </div>
                  </td>
                  <td>{formatPrice(entry.product.price * entry.quantity)}</td>
                  <td>
                    <button type="button" className="btn btn-danger" onClick={() => removeItem(entry.product._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex" style={{ justifyContent: 'space-between', marginTop: 14 }}>
            <div className="small">Total</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{formatPrice(total)}</div>
          </div>

          <div className="flex" style={{ marginTop: 14, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleCheckout}>
              Checkout
            </button>
            <button type="button" className="btn" onClick={clearCart}>
              Clear cart
            </button>
            <button type="button" className="btn" onClick={() => navigate('/')}>
              Continue shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
