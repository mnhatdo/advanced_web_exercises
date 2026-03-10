/**
 * Exercise 58: Fashion Website – RESTful API
 * Project name: server-fashion
 * Chạy: node server/ex58-server.js
 * Port: 4000
 *
 * MongoDB: FashionData / Fashion
 * Schema: { title, details, thumbnail, style, createdAt }
 *
 * APIs:
 *   GET    /api/fashions            – Toàn bộ Fashion, sắp xếp createdAt mới nhất
 *   GET    /api/fashions/style/:style – Filter theo Style
 *   GET    /api/fashions/:id        – Fashion theo ObjectId
 *   POST   /api/fashions            – Thêm Fashion mới
 *   PUT    /api/fashions/:id        – Sửa Fashion
 *   DELETE /api/fashions/:id        – Xoá Fashion
 */

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:4200',
        'http://localhost:4001',
        'http://localhost:4002'
    ],
    credentials: true
}));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect('mongodb://localhost:27017/FashionData')
    .then(() => {
        console.log('✅  MongoDB connected – FashionData');
        seedFashions();
    })
    .catch(err => console.error('❌  MongoDB:', err.message));

// ── Schema & Model ────────────────────────────────────────────────────────────
const fashionSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    details:   { type: String, default: '' },      // HTML content from WYSIWYG editor
    thumbnail: { type: String, default: '' },
    style:     { type: String, required: true },
    createdAt: { type: Date,   default: Date.now }
});

const Fashion = mongoose.model('Fashion', fashionSchema);

// ── Seed Data ─────────────────────────────────────────────────────────────────
async function seedFashions() {
    const count = await Fashion.countDocuments();
    if (count > 0) return;

    const now = new Date();
    const day = (n) => new Date(now - n * 24 * 3600 * 1000);

    await Fashion.insertMany([
        // ── Street Style ──────────────────────────────────────────────────────
        {
            title: "Phil Oh's Best Street Style – Paris Fall 2023",
            details: '<p>There are two street style camps in Paris this season—those who are willing to brave the cold and go coatless for the sake of fashion, and others who are bundling up in their warmest furs and scarves. Phil Oh has captured the best of both approaches.</p><p>Follow along as Phil Oh captures the best street style from the shows here.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4321/master/w_600,c_limit/GettyImages-1462987145.jpg',
            style: 'Street Style',
            createdAt: day(1)
        },
        {
            title: "Phil Oh's Best Street Style – Milan Fall 2023",
            details: '<p>Milan street style celebrated bold tailoring and heritage brands. From checked coats to sleek monochrome looks, the city delivered polish and personality in equal measure.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4322/master/w_600,c_limit/GettyImages-1462987146.jpg',
            style: 'Street Style',
            createdAt: day(2)
        },
        {
            title: "Phil Oh's Best Street Style – London Fall 2023",
            details: '<p>London brought its signature eccentricity to the streets. From vintage-inspired silhouettes to head-to-toe neon, the city proved once again that fashion is about self-expression above all else.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4323/master/w_600,c_limit/GettyImages-1462987147.jpg',
            style: 'Street Style',
            createdAt: day(3)
        },
        {
            title: 'Vivienne Westwood Is Remembered in London',
            details: '<p>Fashion pays tribute to the legendary Dame Vivienne Westwood, whose punk-inspired designs reshaped the fashion world for over five decades.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4324/master/w_600,c_limit/GettyImages-1462987148.jpg',
            style: 'Street Style',
            createdAt: day(4)
        },

        // ── Trends ───────────────────────────────────────────────────────────
        {
            title: 'Why the Short Suit Should Be Your Next Spring Investment',
            details: '<p>The short suit — a blazer paired with matching shorts — is having a major moment. Spotted across runways and street-style scenes alike, it offers a playful yet polished alternative to traditional suiting.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4325/master/w_600,c_limit/GettyImages-1462987149.jpg',
            style: 'Trends',
            createdAt: day(5)
        },
        {
            title: 'Is This the Trend Report of the Future? An AI Interprets the Fall 2023 Menswear Season',
            details: '<p>Artificial intelligence is entering the trend-forecasting conversation. We asked an AI to interpret the key looks from Fall 2023 menswear—and the results were fascinating, uncanny, and occasionally poetic.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4326/master/w_600,c_limit/GettyImages-1462987150.jpg',
            style: 'Trends',
            createdAt: day(6)
        },
        {
            title: 'What Street Style Looked Like a Decade Ago',
            details: '<p>A nostalgic look back at the street style photography of 2013. From oversized everything to the birth of normcore, these archive images capture a pivotal moment in fashion history.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4327/master/w_600,c_limit/GettyImages-1462987151.jpg',
            style: 'Trends',
            createdAt: day(7)
        },
        {
            title: "Men, Skirts Aren't That Scary—Promise!",
            details: '<p>The gender-fluid fashion movement is pushing skirts into menswear mainstream. Designers from Loewe to Wales Bonner have championed the look, showing it can be masculine, powerful, and utterly stylish.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4328/master/w_600,c_limit/GettyImages-1462987152.jpg',
            style: 'Trends',
            createdAt: day(8)
        },

        // ── Runway ───────────────────────────────────────────────────────────
        {
            title: 'Chanel Fall 2023 Ready-to-Wear Collection',
            details: '<p>Virginie Viard\'s vision for Chanel this season was intimate and personal. Tweed suits in unexpected colors, fluid eveningwear, and the iconic double-C monogram woven throughout a collection that felt like a love letter to the house.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab4329/master/w_600,c_limit/GettyImages-1462987153.jpg',
            style: 'Runway',
            createdAt: day(9)
        },
        {
            title: 'Dior Fall 2023 Ready-to-Wear Collection',
            details: '<p>Maria Grazia Chiuri continued her dialogue between feminist scholarship and Dior couture heritage. Sheer layers, bold embroidery, and collaborations with artists made this a collection that transcended trends.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab432a/master/w_600,c_limit/GettyImages-1462987154.jpg',
            style: 'Runway',
            createdAt: day(10)
        },
        {
            title: 'Balenciaga Fall 2023 Ready-to-Wear Collection',
            details: '<p>Demna\'s post-controversy collection was a study in restraint. Precise tailoring, quiet luxury codes, and an absence of the provocations that once defined the house. A new chapter begins.</p>',
            thumbnail: 'https://assets.vogue.com/photos/63e3e8a3e8a5ac0ba2ab432b/master/w_600,c_limit/GettyImages-1462987155.jpg',
            style: 'Runway',
            createdAt: day(11)
        }
    ]);

    console.log('✅  Seeded 11 Fashion documents into FashionData.Fashion');
}

// ── GET /api/fashions – All fashions sorted by createdAt DESC ─────────────────
app.get('/api/fashions', async (req, res) => {
    try {
        const fashions = await Fashion.find().sort({ createdAt: -1 });
        res.json(fashions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── GET /api/fashions/style/:style – Filter by style ─────────────────────────
app.get('/api/fashions/style/:style', async (req, res) => {
    try {
        const fashions = await Fashion.find({
            style: { $regex: new RegExp(`^${req.params.style}$`, 'i') }
        }).sort({ createdAt: -1 });
        res.json(fashions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── GET /api/fashions/:id – Single fashion by ObjectId ────────────────────────
app.get('/api/fashions/:id', async (req, res) => {
    try {
        const fashion = await Fashion.findById(req.params.id);
        if (!fashion) return res.status(404).json({ message: 'Fashion not found' });
        res.json(fashion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST /api/fashions – Add new fashion ─────────────────────────────────────
app.post('/api/fashions', async (req, res) => {
    const { title, details, thumbnail, style } = req.body;
    if (!title || !style) {
        return res.status(400).json({ message: 'title and style are required' });
    }
    try {
        const fashion = new Fashion({ title, details, thumbnail, style });
        const saved = await fashion.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── PUT /api/fashions/:id – Update fashion ────────────────────────────────────
app.put('/api/fashions/:id', async (req, res) => {
    const { title, details, thumbnail, style } = req.body;
    try {
        const updated = await Fashion.findByIdAndUpdate(
            req.params.id,
            { title, details, thumbnail, style },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Fashion not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── DELETE /api/fashions/:id – Delete fashion ────────────────────────────────
app.delete('/api/fashions/:id', async (req, res) => {
    try {
        const deleted = await Fashion.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Fashion not found' });
        res.json({ message: 'Fashion deleted', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀  server-fashion running on http://localhost:${PORT}`);
    console.log('   GET    /api/fashions');
    console.log('   GET    /api/fashions/style/:style');
    console.log('   GET    /api/fashions/:id');
    console.log('   POST   /api/fashions');
    console.log('   PUT    /api/fashions/:id');
    console.log('   DELETE /api/fashions/:id');
});
