import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api.js';
import { useCart } from '../contexts/CartContext.jsx';

function formatPrice(value) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value ?? 0);
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    apiFetch(`/api/fake-products/${id}`)
      .then((data) => {
        if (active) {
          setProduct(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product._id, 1);
    setToast(`Added to cart: ${product.name}`);
    window.setTimeout(() => setToast(null), 1800);
  };

  if (loading) {
    return <div className="page">Loading product...</div>;
  }

  if (error) {
    return <div className="page toast err">{error}</div>;
  }

  if (!product) {
    return <div className="page toast err">Product not found.</div>;
  }

  return (
    <div className="page detail-page">
      {toast ? <div className="toast ok">{toast}</div> : null}
      <div className="flex">
        <div className="col">
          <img
            className="detail-img"
            src={product.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={product.name}
          />
        </div>
        <div className="col">
          <h1>{product.name}</h1>
          <div className="muted small">Stock: {product.stock ?? 0}</div>
          <div className="price">{formatPrice(product.price)}</div>
          <p>{product.description || 'No description available.'}</p>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
