import { apiFetch } from './api.js';

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

function addToCart(productId, quantity) {
  const cart = readCart();
  const qty = Number(quantity);
  const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
  if (idx >= 0) cart.items[idx].quantity += qty;
  else cart.items.push({ productId, quantity: qty });
  writeCart(cart);
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

(async function init() {
  const id = getQueryParam('id');
  const container = document.getElementById('productDetail');
  if (!id || !container) return;

  try {
    const p = await apiFetch(`/api/products/${id}`);

    container.innerHTML = `
      <div class="flex">
        <div class="col">
          <img class="detail-img" src="${p.imageUrl || ''}" alt="${p.name}" />
        </div>
        <div class="col">
          <h2 style="margin-top:0">${p.name}</h2>
          <div class="price">${formatPrice(p.price)}</div>
          <p class="muted">${p.description || ''}</p>
          <div class="small">Stock: ${p.stock ?? 0}</div>

          <div style="margin-top:14px" class="page">
            <div class="qty-row">
              <label class="label">Quantity</label>
              <input id="qtyInput" type="number" min="1" value="1" style="width:140px" />
              <button id="addBtn" class="btn btn-primary">Add to cart</button>
            </div>
            <div id="detailToast" class="toast" style="display:none;margin-top:12px"></div>
          </div>

          <div style="margin-top:14px">
            <a class="btn" href="./cart.html">Go to cart</a>
          </div>
        </div>
      </div>
    `;

    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', () => {
      const qty = document.getElementById('qtyInput').value;
      const qn = Number(qty);
      if (!Number.isFinite(qn) || qn < 1) {
        showToast('Quantity must be >= 1', true);
        return;
      }
      addToCart(p._id, qn);
      showToast('Added to cart', false);
    });

    function showToast(msg, isErr) {
      const t = document.getElementById('detailToast');
      t.style.display = 'block';
      t.className = isErr ? 'toast err' : 'toast ok';
      t.textContent = msg;
      setTimeout(() => {
        t.textContent = '';
        t.style.display = 'none';
      }, 1800);
    }
  } catch (e) {
    container.innerHTML = `<div class="toast err">Failed to load product: ${e.message}</div>`;
  }
})();

