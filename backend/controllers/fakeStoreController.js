const PRICE_DEFAULT_STOCK = 99;

function mapFakeToFrontend(p, idx) {
  return {
    _id: p.id != null ? String(p.id) : String(idx),
    name: p.title,
    description: p.description || '',
    price: p.price,
    imageUrl: p.image,
    category: p.category || '',
    stock: PRICE_DEFAULT_STOCK,
    createdAt: new Date(),
  };
}


async function listFakeProducts(req, res) {
  try {
    const resp = await fetch('https://fakestoreapi.com/products');
    if (!resp.ok) {
      return res.status(502).json({ msg: 'Fake Store API failed', status: resp.status });
    }

    const data = await resp.json();
    const mapped = Array.isArray(data) ? data.map(mapFakeToFrontend) : [];
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ msg: 'Failed to fetch Fake Store products', error: e.message });
  }
}

async function getFakeProductById(req, res) {
  try {
    const { id } = req.params;
    const resp = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!resp.ok) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const data = await resp.json();
    res.json(mapFakeToFrontend(data, data?.id));
  } catch (e) {
    res.status(500).json({ msg: 'Failed to fetch Fake Store product', error: e.message });
  }
}

module.exports = { listFakeProducts, getFakeProductById };

