import { apiFetch, getAuthToken } from './api.js';

function formatPrice(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n ?? 0);
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function readCart() {
  const raw = localStorage.getItem('cart');
  if (!raw) return { items: [] };
  try { return JSON.parse(raw); } catch { return { items: [] }; }
}

function writeCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const cart = readCart();
  const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
  if (idx >= 0) cart.items[idx].quantity += quantity;
  else cart.items.push({ productId, quantity });
  writeCart(cart);
}

function cartCount() {
  const cart = readCart();
  return cart.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
}

function renderProductCard(p) {
  const img = p.imageUrl ? p.imageUrl : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#0f1730"/><text x="50%" y="50%" fill="#94a3b8" font-family="Arial" font-size="22" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>`);

  const card = el(`
    <div class="card">
      <img class="product-img" src="${img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="muted small">Stock: ${p.stock ?? 0}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <div class="actions">
        <a class="btn btn-primary" href="./product.html?id=${p._id}">View</a>
        <button class="btn" data-add="${p._id}">Add to cart</button>
      </div>
    </div>
  `);

  card.querySelector('[data-add]').addEventListener('click', () => {
    addToCart(p._id, 1);
    const t = document.getElementById('cartToast');
    if (t) {
      t.className = 'toast ok';
      t.textContent = `Added to cart: ${p.name}`;
      setTimeout(() => { t.textContent=''; t.className=''; }, 1800);
    }

    // Optional: update cart badge if present
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = String(cartCount());
  });

  return card;
}

async function loadProducts() {
  const res = await apiFetch('/api/fake-products');
  return Array.isArray(res) ? res : [];
}

function setupSearch(products) {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const filtered = products.filter(p => (p.name || '').toLowerCase().includes(q));
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    filtered.forEach(p => grid.appendChild(renderProductCard(p)));
  });
}

(async function init() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // cart badge (optional)
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = String(cartCount());

  const toastWrap = el(`<div id="cartToast" class="toast" style="display:none"></div>`);
  // Put toast right below toolbar if present
  const toolbar = document.querySelector('.toolbar');
  if (toolbar) {
    toastWrap.style.display = 'block';
    toolbar.parentNode.insertBefore(toastWrap, toolbar.nextSibling);
  }

  try {
    const products = await loadProducts();
    grid.innerHTML = '';
    products.forEach(p => grid.appendChild(renderProductCard(p)));
    setupSearch(products);
  } catch (e) {
    grid.innerHTML = `<div class="toast err">Failed to load products: ${e.message}</div>`;
  }
})();

