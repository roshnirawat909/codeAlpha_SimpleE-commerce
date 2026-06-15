const Product = require('../models/Product');

async function listProducts(req, res) {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(200);
  res.json(products);
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid product id' });
  }
}


module.exports = { listProducts, getProductById };

