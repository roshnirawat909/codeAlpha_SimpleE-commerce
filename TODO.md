# TODO - Fix server error (Invalid product id / 500 on /api/orders)

## Step 1
Locate cart implementation that calls `GET /api/products/:id` with fake ids.
- Files likely: `frontend/js/cart.js` (static cart) and/or React `frontend/src/pages/Cart.jsx`.

## Step 2
Patch the static cart (if used) to fetch from `/api/fake-products/:id` instead of `/api/products/:id`.

## Step 3
After cart loads correctly, verify checkout.
- If `/api/orders` still returns 500, fix id-mismatch between fake cart ids and Mongo `Product` ObjectIds.

## Step 4
Implement one consistent strategy (choose during implementation):
- A) Convert fake products into Mongo products during checkout, or
- B) Store fake product ids as strings in Order schema, or
- C) Use Mongo products only in cart.

## Step 5
Restart backend, clear browser cart/localStorage, retest:
- Add to cart
- Load cart
- Checkout

