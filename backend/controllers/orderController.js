const Order = require('../models/Order');


async function placeOrder(req, res) {
  try {
    const userId = req.user.userId;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Items are required' });
    }

    // Validate items and enrich from Fake Store instead of Mongo Product.
    // The cart UI uses /api/fake-products ids (e.g. 1,2,...) so item.productId is NOT a Mongo ObjectId.
    const enriched = [];
    let total = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ msg: 'Quantity must be >= 1' });
      }

      // Expect fake-product id
      const resp = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
      if (!resp.ok) {
        return res.status(400).json({ msg: `Invalid product: ${item.productId}` });
      }

      const p = await resp.json();
      const price = p.price;

      total += price * quantity;

      enriched.push({
        productId: String(p.id),
        name: p.title,
        price,
        quantity,
      });
    }


    const order = await Order.create({ userId, items: enriched, total, status: 'placed' });

    res.json({ msg: 'Order placed', order });
  } catch (err) {
    console.error('placeOrder error:', err);
    res.status(500).json({ msg: 'Server error', error: err?.message });
  }
}

module.exports = { placeOrder };

