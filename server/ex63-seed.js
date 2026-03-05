/**
 * ex63-seed.js – Scrape product data from fakestoreapi.com
 * then seed into MongoDB FashionData.Product
 *
 * Chạy: node ex63-seed.js
 *
 * Sources:
 *   https://fakestoreapi.com/products/category/jewelery   (4 items)
 *   https://fakestoreapi.com/products/category/women's clothing (6 items)
 */

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/FashionData';

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

async function scrape() {
    console.log('🔍 Đang cào dữ liệu từ fakestoreapi.com...');

    const [jewelry, clothing] = await Promise.all([
        fetch('https://fakestoreapi.com/products/category/jewelery').then(r => r.json()),
        fetch("https://fakestoreapi.com/products/category/women's%20clothing").then(r => r.json())
    ]);

    const raw = [...jewelry, ...clothing];
    console.log(`✅  Cào được ${raw.length} sản phẩm (${jewelry.length} trang sức + ${clothing.length} thời trang nữ)`);

    return raw.map(p => ({
        name:        p.title,
        price:       p.price,
        image:       p.image,
        description: p.description,
        category:    p.category === 'jewelery' ? 'Jewelry' : "Women's Fashion",
        rating:      p.rating?.rate   ?? 0,
        ratingCount: p.rating?.count  ?? 0
    }));
}

async function run() {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected – FashionData');

    // Xoá dữ liệu cũ (seed thủ công + dữ liệu cũ)
    const deleted = await Product.deleteMany({});
    console.log(`🗑️   Đã xoá ${deleted.deletedCount} sản phẩm cũ`);

    const products = await scrape();

    const inserted = await Product.insertMany(products);
    console.log(`📦  Đã lưu ${inserted.length} sản phẩm vào FashionData.Product:`);
    inserted.forEach((p, i) => {
        console.log(`    [${i + 1}] ${p.name.substring(0, 55).padEnd(55)} $${p.price.toFixed(2)}  ⭐${p.rating}`);
    });

    await mongoose.disconnect();
    console.log('\n✅  Seed hoàn tất! Chạy "node ex63-server.js" để khởi động server.\n');
}

run().catch(err => {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
});
