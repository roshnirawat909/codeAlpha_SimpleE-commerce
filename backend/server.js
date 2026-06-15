const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{ // make sure app doesn't crash on unexpected empty bodies
  if(req.method !== 'GET' && !req.is('application/json')) return next();
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'CodeAlpha SimpleEcommerce Backend - Ready!' });
});

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/fake-products', require('./routes/fakeStoreRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));


async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('⚠️ MongoDB unavailable:', err.message);
    console.log('Server will still start, but DB operations may fail.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();

