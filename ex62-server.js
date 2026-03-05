/**
 * Exercise 62: Session Programming
 * Chạy: node ex62-server.js
 * Port: 3004
 *
 * APIs:
 *   GET /contact          – Demo session visit counter
 *   GET /reset-session    – Xoá session hiện tại
 *   GET /session-info     – Xem toàn bộ session data (debug)
 */

const express = require('express');
const cors    = require('cors');
var session   = require('express-session');

const app = express();
app.use(express.json());
app.use(cors());

// Step 2: Set Session object initialization
app.use(session({ secret: "Shh, its a secret!", resave: false, saveUninitialized: true }));

// Step 3: API to create Session visited counter
app.get("/contact", cors(), (req, res) => {
    if (req.session.visited != null) {
        req.session.visited++;
        res.send("You visited this page " + req.session.visited + " times");
    } else {
        req.session.visited = 1;
        res.send("Welcome to this page for the first time!");
    }
});

// Bonus: Store a JsonObject in session (demonstrates "any data structure")
app.get("/set-user", cors(), (req, res) => {
    req.session.user = { username: "tranduythanh", role: "admin", loginAt: new Date() };
    res.send("User object stored in session");
});

// Bonus: Read the stored user object from session
app.get("/get-user", cors(), (req, res) => {
    if (req.session.user != null) {
        res.json(req.session.user);
    } else {
        res.send("No user in session. Call /set-user first.");
    }
});

// Xoá toàn bộ session
app.get("/reset-session", cors(), (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Could not reset session");
        res.send("Session has been reset");
    });
});

// Xem nội dung session hiện tại (debug)
app.get("/session-info", cors(), (req, res) => {
    res.json(req.session);
});

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`\n✅  Ex62 Session server đang chạy tại http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/contact`);
    console.log(`   GET http://localhost:${PORT}/set-user`);
    console.log(`   GET http://localhost:${PORT}/get-user`);
    console.log(`   GET http://localhost:${PORT}/reset-session`);
    console.log(`   GET http://localhost:${PORT}/session-info\n`);
});
