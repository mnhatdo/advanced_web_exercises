/**
 * Exercise 63: Session Programming – Shopping Cart
 * Chạy: node ex63-server.js
 * Port: 3005
 *
 * MongoDB: FashionData / Product
 *
 * Session cart structure:
 *   req.session.cart = [
 *     { product: {...}, qty: Number }
 *   ]
 *
 * APIs:
 *   GET    /ex63/products          – Lấy danh sách sản phẩm
 *   GET    /ex63/cart              – Xem giỏ hàng (session)
 *   POST   /ex63/cart/add         – Thêm sản phẩm vào giỏ
 *   PUT    /ex63/cart/update      – Cập nhật số lượng (body: [{productId, qty}])
 *   DELETE /ex63/cart/remove/:id  – Xoá 1 sản phẩm khỏi giỏ
 *   DELETE /ex63/cart/clear       – Xoá toàn bộ giỏ hàng
 */

const express = require('express');
const cors    = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:4000'],
    credentials: true
}));

// ── Session init ──────────────────────────────────────────────────────────────
app.use(session({
    secret: 'ex63-shopping-cart-secret',
    resave: false,
    saveUninitialized: true
}));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect('mongodb://localhost:27017/FashionData')
    .then(() => { console.log('✅  MongoDB connected – FashionData'); seedProducts(); })
    .catch(err => console.error('❌  MongoDB:', err.message));

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, default: '' },
    description: { type: String, default: '' },
    category:    { type: String, default: 'General' },
    rating:      { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
});
const Product = mongoose.model('Product', productSchema);

async function seedProducts() {
    const count = await Product.countDocuments();
    if (count === 0) {
        await Product.insertMany([
            { name: 'Diamond Promise Ring 1/6 ct tw Round-cut 10K White Gold',    price: 399.99, category: 'Ring', rating: 0, image: 'https://i.imgur.com/Q1kFnjS.jpeg', description: '1/6 ct tw round-cut diamonds in 10K white gold' },
            { name: 'Diamond Promise Ring 1/4 ct tw Round/Baguette 10K White Gold',price: 529.00, category: 'Ring', rating: 0, image: 'https://i.imgur.com/GzKnkiW.jpeg', description: '1/4 ct tw round and baguette diamonds, 10K white gold' },
            { name: 'Diamond Promise Ring 1/6 ct tw Black/White Sterling Silver',  price: 159.00, category: 'Ring', rating: 0, image: 'https://i.imgur.com/5VRas3E.jpeg', description: '1/6 ct tw black and white diamonds in sterling silver' },
            { name: 'Diamond Promise Ring 1/5 ct tw Round-cut Sterling Silver',    price: 289.00, category: 'Ring', rating: 0, image: 'https://i.imgur.com/Wb0WL7f.jpeg', description: '1/5 ct tw round-cut diamonds in sterling silver' },
            { name: 'Diamond Promise Ring 1/5 ct tw Round-cut Sterling Silver',    price: 289.00, category: 'Ring', rating: 0, image: 'https://i.imgur.com/OuNsziM.jpeg', description: 'Heart-shaped halo ring with 1/5 ct tw round-cut diamonds' },
            { name: 'Diamond Promise Ring 1/8 ct tw Round-cut Sterling Silver Ring',price:229.00, category: 'Ring', rating: 0, image: 'https://i.imgur.com/Ux2h3Fg.jpeg', description: '1/8 ct tw twisted band with round-cut diamonds, sterling silver' }
        ]);
        console.log('✅  Seeded 6 sample products into FashionData.Product');
    }
}

// ── Helper: init cart ─────────────────────────────────────────────────────────
function getCart(req) {
    if (!req.session.cart) req.session.cart = [];
    return req.session.cart;
}

// ── GET /ex63/products ────────────────────────────────────────────────────────
app.get('/ex63/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── GET /ex63/cart ────────────────────────────────────────────────────────────
app.get('/ex63/cart', (req, res) => {
    res.json(getCart(req));
});

// ── POST /ex63/cart/add ───────────────────────────────────────────────────────
// Body: { productId }
app.post('/ex63/cart/add', async (req, res) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const cart = getCart(req);
        const existing = cart.find(item => item.product._id.toString() === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ product: product.toObject(), qty: 1 });
        }
        req.session.cart = cart;
        res.json({ message: 'Added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── PUT /ex63/cart/update ─────────────────────────────────────────────────────
// Body: [{ productId, qty }]  – qty <= 0 removes the item
app.put('/ex63/cart/update', (req, res) => {
    const updates = req.body; // array
    if (!Array.isArray(updates)) return res.status(400).json({ message: 'Expected an array' });

    let cart = getCart(req);
    updates.forEach(({ productId, qty }) => {
        if (qty <= 0) {
            cart = cart.filter(item => item.product._id.toString() !== productId);
        } else {
            const item = cart.find(item => item.product._id.toString() === productId);
            if (item) item.qty = qty;
        }
    });
    req.session.cart = cart;
    res.json({ message: 'Cart updated', cart });
});

// ── DELETE /ex63/cart/remove/:id ─────────────────────────────────────────────
app.delete('/ex63/cart/remove/:id', (req, res) => {
    const cart = getCart(req).filter(item => item.product._id.toString() !== req.params.id);
    req.session.cart = cart;
    res.json({ message: 'Item removed', cart });
});

// ── DELETE /ex63/cart/clear ───────────────────────────────────────────────────
app.delete('/ex63/cart/clear', (req, res) => {
    req.session.cart = [];
    res.json({ message: 'Cart cleared' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`\n✅  Ex63 Shopping Cart server đang chạy tại http://localhost:${PORT}`);
    console.log(`   GET    http://localhost:${PORT}/ex63/products`);
    console.log(`   GET    http://localhost:${PORT}/ex63/cart`);
    console.log(`   POST   http://localhost:${PORT}/ex63/cart/add`);
    console.log(`   PUT    http://localhost:${PORT}/ex63/cart/update`);
    console.log(`   DELETE http://localhost:${PORT}/ex63/cart/remove/:id`);
    console.log(`   DELETE http://localhost:${PORT}/ex63/cart/clear\n`);
});
