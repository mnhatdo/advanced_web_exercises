/**
 * Exercise 61: Cookies – Save Login Information
 * Chạy: node ex61-server.js
 * Port: 3003
 *
 * MongoDB: FashionData / User { username, password }
 *
 * APIs:
 *   POST /ex61/login        – Xác thực, lưu cookie nếu đúng
 *   GET  /ex61/read-cookie  – Trả về thông tin cookie đã lưu
 *   POST /ex61/logout       – Xoá cookie đăng nhập
 */

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const mongoose     = require('mongoose');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:4000'],
    credentials: true   // bắt buộc để trình duyệt gửi/nhận cookie cross-origin
}));

// ── MongoDB connection ────────────────────────────────────────────────────────
const MONGO_URI = 'mongodb://localhost:27017/FashionData';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅  MongoDB connected – FashionData');
        seedUsers();
    })
    .catch(err => console.error('❌  MongoDB error:', err.message));

// ── Mongoose model ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Seed một số tài khoản mẫu nếu collection chưa có dữ liệu
async function seedUsers() {
    const count = await User.countDocuments();
    if (count === 0) {
        await User.insertMany([
            { username: 'tranduythanh', password: '123456' },
            { username: 'admin',        password: 'admin@123' },
            { username: 'student',      password: 'student1' }
        ]);
        console.log('✅  Seeded 3 sample users into FashionData.User');
    }
}

// ── POST /ex61/login ──────────────────────────────────────────────────────────
// Body: { username, password }
app.post('/ex61/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ username và password' });
    }

    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }

        // Lưu thông tin đăng nhập vào cookie (7 ngày)
        const cookieOptions = { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false };
        res.cookie('login_username', user.username, cookieOptions);
        res.cookie('login_password', user.password, cookieOptions);

        return res.json({ success: true, message: 'Đăng nhập thành công', username: user.username });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
});

// ── GET /ex61/read-cookie ─────────────────────────────────────────────────────
// Đọc cookie đăng nhập và trả về cho client để pre-fill form
app.get('/ex61/read-cookie', (req, res) => {
    const username = req.cookies.login_username || '';
    const password = req.cookies.login_password || '';
    res.json({ username, password });
});

// ── POST /ex61/logout ─────────────────────────────────────────────────────────
app.post('/ex61/logout', (req, res) => {
    res.clearCookie('login_username');
    res.clearCookie('login_password');
    res.json({ success: true, message: 'Đã xoá cookie đăng nhập' });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`\n✅  Ex61 server đang chạy tại http://localhost:${PORT}`);
    console.log(`   POST http://localhost:${PORT}/ex61/login`);
    console.log(`   GET  http://localhost:${PORT}/ex61/read-cookie`);
    console.log(`   POST http://localhost:${PORT}/ex61/logout\n`);
});
