/**
 * Exercise 60: Cookies Programming
 * Chạy: node ex60-server.js
 * Port: 3002
 *
 * APIs:
 *   GET /create-cookie  – Tạo cookie (string & JsonObject)
 *   GET /read-cookie    – Đọc cookie (với null check)
 *   GET /clear-cookie   – Xoá cookie "account"
 */

const express      = require('express');
const cors         = require('cors');
var cookieParser   = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());

// Step 2: Initialize Cookie object
app.use(cookieParser());

// Step 3: API to create Cookies (single value & JsonObject)
app.get("/create-cookie", cors(), (req, res) => {
    res.cookie("username", "tranduythanh");
    res.cookie("password", "123456");
    // Tạo thêm cookies có timeout
    res.cookie("infor_limit1", "I am limited Cookie - way 1", { expires: new Date(Date.now() + 360000) });
    res.cookie("infor_limit2", "I am limited Cookie - way 2", { maxAge: 360000 });
    let account = { "username": "tranduythanh", "password": "123456" };
    res.cookie("account", account);
    res.send("cookies are created");
});

// Step 5 + Step 6 (null check): API to read Cookies
app.get("/read-cookie", cors(), (req, res) => {
    // cookie is stored in client, so we use req
    let username = req.cookies.username;
    let password = req.cookies.password;
    let account  = req.cookies.account;

    let infor = "username = " + username + "<br/>";
    infor    += "password = " + password + "<br/>";
    if (account != null) {
        infor += "account.username = " + account.username + "<br/>";
        infor += "account.password = " + account.password + "<br/>";
    }
    res.send(infor);
});

// Step 6: API to clear Cookie
app.get("/clear-cookie", cors(), (req, res) => {
    res.clearCookie("account");
    res.send("[account] Cookie is removed");
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`\n✅  Cookie server đang chạy tại http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/create-cookie`);
    console.log(`   GET http://localhost:${PORT}/read-cookie`);
    console.log(`   GET http://localhost:${PORT}/clear-cookie\n`);
});
