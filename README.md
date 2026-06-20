# SimpleEcommerce

Simple full-stack e-commerce store:
- Products (listing + details)
- Cart (frontend localStorage)
- Login/Register (JWT)
- Orders (stored in MongoDB)

---

## Folder Structure
```
SimpleEcommerce/
  frontend/
    index.html
    product.html
    cart.html
    login.html
    register.html
    /css
      styles.css
    /js
      api.js
      products.js
      productDetail.js
      cart.js
      auth.js
  backend/
    package.json
    server.js
    /config
      db.js
    /models
      Product.js
      User.js
      Order.js
    /middleware
      authMiddleware.js
    /routes
      productRoutes.js
      userRoutes.js
      orderRoutes.js
    /controllers
      productController.js
      userController.js
      orderController.js
    .env.example
```

---

## Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)

---

## Backend Setup
```bat
cd C:/Users/HP/Desktop/SimpleEcommerce/backend
npm install
copy .env.example .env
```

Edit `.env` with your Mongo connection string.

Start backend:
```bat
node server.js
```

Default port: `5001`

---

## Frontend Setup
Open the pages inside `frontend/` in a browser.

> The frontend uses `fetch` to call backend APIs at `http://localhost:5001`.

---

## API Endpoints
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/orders` (JWT protected)

