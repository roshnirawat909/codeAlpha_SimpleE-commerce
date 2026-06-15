const Order = require('../models/Order');
const Product = require('../models/Product');

async function placeOrder(req, res) {
  try {
    const userId = req.user.userId;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Items are required' });
    }

    // Validate items and enrich from DB
    const enriched = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ msg: `Invalid product: ${item.productId}` });

      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ msg: 'Quantity must be >= 1' });
      }

      const price = product.price;
      total += price * quantity;

      enriched.push({
        productId: product._id,
        name: product.name,
        price,
        quantity
      });
    }

    const order = await Order.create({ userId, items: enriched, total, status: 'placed' });

    res.json({ msg: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports = { placeOrder };

