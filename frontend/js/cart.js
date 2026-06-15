import { apiFetch, getAuthToken } from './api.js';

function formatPrice(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n ?? 0);
}

function readCart() {
  const raw = localStorage.getItem('cart');
  if (!raw) return { items: [] };
  try { return JSON.parse(raw); } catch { return { items: [] }; }
}

function writeCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function setToast(el, msg, ok) {
  el.textContent = msg;
  el.className = ok ? 'toast ok' : 'toast err';
  el.style.display = 'block';
}

function render() {
  const tableBody = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const toastEl = document.getElementById('cartToast');
  const empty = document.getElementById('cartEmpty');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const cart = readCart();
  const items = cart.items || [];

  if (!tableBody || !totalEl) return;

  if (items.length === 0) {
    if (empty) empty.style.display = 'block';
    tableBody.innerHTML = '';
    totalEl.textContent = formatPrice(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (toastEl) toastEl.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;

  tableBody.innerHTML = '';

  let total = 0;
  // We already store only productId+quantity; to show total we can fetch all products.
  // For simplicity, fetch sequentially.
  return Promise.all(items.map(async i => {
    const p = await apiFetch(`/api/products/${i.productId}`);
    const qty = Number(i.quantity || 0);
    const line = p.price * qty;
    total += line;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${formatPrice(p.price)}</td>
      <td>
        <div class="qty-row">
          <button class="btn" data-dec="${p._id}">-</button>
          <span style="min-width:42px;text-align:center" class="muted" id="qty-${p._id}">${qty}</span>
          <button class="btn" data-inc="${p._id}">+</button>
        </div>
      </td>
      <td>${formatPrice(line)}</td>
      <td>
        <button class="btn btn-danger" data-remove="${p._id}">Remove</button>
      </td>
    `;

    tr.querySelector('[data-inc]').addEventListener('click', () => {
      updateQty(p._id, +1);
    });
    tr.querySelector('[data-dec]').addEventListener('click', () => {
      updateQty(p._id, -1);
    });
    tr.querySelector('[data-remove]').addEventListener('click', () => {
      removeItem(p._id);
    });

    tableBody.appendChild(tr);
  })).then(() => {
    totalEl.textContent = formatPrice(total);
  }).catch(e => {
    if (toastEl) setToast(toastEl, `Failed to load cart products: ${e.message}`, false);
  });

  function updateQty(productId, delta) {
    const cart = readCart();
    const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
    if (idx < 0) return;
    cart.items[idx].quantity += delta;
    if (cart.items[idx].quantity <= 0) cart.items.splice(idx, 1);
    writeCart(cart);
    render();
  }

  function removeItem(productId) {
    const cart = readCart();
    cart.items = (cart.items || []).filter(i => String(i.productId) !== String(productId));
    writeCart(cart);
    render();
  }
}

async function checkout() {
  const toastEl = document.getElementById('cartToast');
  const cart = readCart();
  const items = cart.items || [];

  if (items.length === 0) return;

  const token = getAuthToken();
  if (!token) {
    setToast(toastEl, 'Please login to place an order.', false);
    setTimeout(() => location.href = './login.html', 900);
    return;
  }

  try {
    const payload = { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) };
    const data = await apiFetch('/api/orders', {
      method: 'POST',
      headers: { 'x-auth-token': token },
      body: payload
    });

    // Clear cart
    localStorage.removeItem('cart');
    setToast(toastEl, data?.msg || 'Order placed!', true);
    setTimeout(() => { location.href = './index.html'; }, 1200);
  } catch (e) {
    setToast(toastEl, e.message || 'Checkout failed', false);
  }
}

(async function init() {
  if (document.getElementById('cartItems')) {
    await render();
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
  }
})();

