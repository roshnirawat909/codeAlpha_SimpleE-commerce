import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { apiFetch } from '../api.js';

function formatPrice(value) {

  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value ?? 0);
}

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    apiFetch('/api/fake-products')
      .then((data) => {
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, search]);

  const handleAddToCart = (product) => {
    addItem(product._id, 1);
    setToast(`Added to cart: ${product.name}`);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <>
      <section className="hero">
        <h1>Products</h1>
        <p>Browse items and add them to your cart.</p>
      </section>

      <section className="toolbar">
        <input
          className="input"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {toast ? <div className="toast ok">{toast}</div> : null}
      {error ? <div className="toast err">{error}</div> : null}

      <section className="category-links">
        <div className="category-links-inner">
          <Link className="btn" to="/category/jewelery">Jewelry</Link>
          <Link className="btn" to="/category/electronics">Electronics</Link>
          <Link className="btn" to="/category/men's clothing">Men's Clothing</Link>
          <Link className="btn" to="/category/women's clothing">Women\u2019s Clothing</Link>
        </div>
      </section>


      <section className="grid" aria-live="polite">
        {filteredProducts.map((product) => (

          <article key={product._id} className="card">
            <img
              className="product-img"
              src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <div className="muted small">Stock: {product.stock ?? 0}</div>
            <div className="price">{formatPrice(product.price)}</div>
            <div className="actions">
              <Link className="btn btn-primary" to={`/product/${product._id}`}>
                View
              </Link>
              <button type="button" className="btn" onClick={() => handleAddToCart(product)}>
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export default Home;
