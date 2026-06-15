import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CategoryProducts from './pages/CategoryProducts.jsx';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category/jewelery" element={<CategoryProducts category="jewelery" title="Jewelry" />} />
            <Route path="/category/electronics" element={<CategoryProducts category="electronics" title="Electronics" />} />
            <Route path="/category/men's clothing" element={<CategoryProducts category="men's clothing" title="Men's Clothing" />} />
            <Route path="/category/women's clothing" element={<CategoryProducts category="women's clothing" title="Women\u2019s Clothing" />} />
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
