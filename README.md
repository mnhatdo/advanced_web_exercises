# Advanced Business Web Development – Exercises

A collection of Angular + Node.js exercises for the Advanced Business Web Development course.  
UI: Angular 21 (standalone components, retro-inspired design).  
Backend: Express.js + MongoDB (Mongoose) – one server file per exercise.

---

## Project Structure

```
advanced_web_exercises/
│
├── server/                         # Node.js / Express back-end servers
│   ├── momo-server.js              # ExMomo  – MoMo payment gateway (port 3030)
│   ├── ex60-server.js              # Ex60    – Cookies demo (port 3002)
│   ├── ex61-server.js              # Ex61    – Cookie login (port 3003)
│   ├── ex62-server.js              # Ex62    – Session demo (port 3004)
│   ├── ex63-server.js              # Ex63    – Session shopping cart (port 3005)
│   └── ex63-seed.js                # Ex63    – Scrape & seed products from fakestoreapi
│
├── src/                            # Angular 21 application (single SPA)
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   └── app/
│       ├── app.component.ts        # Root shell + tab navigation
│       ├── app.config.ts
│       ├── app.routes.ts           # Centralised routing
│       ├── customer-grouping/      # Ex18 – Customer grouping
│       ├── ex-momo/                # ExMomo – MoMo payment shop
│       ├── ex13/                   # Ex13 – Product service + images + events
│       ├── ex14/                   # Ex14 – Catalog service
│       ├── ex50/                   # Ex50 – Book CRUD (RESTful API)
│       ├── ex61/                   # Ex61 – Cookie login form
│       └── ex63/                   # Ex63 – Session shopping cart
│
├── public/                         # Static assets served by Angular
│   └── assets/
│       ├── avatars/
│       ├── images/
│       └── data/
│           ├── books.json
│           └── customers.json
│
├── docs/                           # Architecture & migration notes
│   ├── ARCHITECTURE_VALIDATION.md
│   └── MIGRATION_MAP.md
│
├── angular.json
├── package.json                    # Shared deps for Angular + all servers
├── tsconfig.json
└── tsconfig.app.json
```

---

## Exercises Overview

| # | Exercise | Angular route | Server | Port | Key topic |
|---|---|---|---|---|---|
| Ex13 | Product Service + Images + Events | `/ex13/service-product-image-event` | – | – | Services, events |
| Ex14 | Catalog Service | `/ex14/catalog` | – | – | Category service |
| Ex18 | Customer Grouping | `/ex18/customer-grouping` | – | – | HTTP + grouping |
| Ex50 | Book Management (CRUD) | `/ex50/books` | – | – | RESTful simulation |
| ExMomo | MoMo Payment Shop | `/ex-momo` | `momo-server.js` | 3030 | Payment gateway |
| Ex60 | Cookies Programming | – | `ex60-server.js` | 3002 | cookie-parser |
| Ex61 | Cookie Login | `/ex61/login` | `ex61-server.js` | 3003 | Cookie + MongoDB auth |
| Ex62 | Session Programming | – | `ex62-server.js` | 3004 | express-session |
| Ex63 | Session Shopping Cart | `/ex63/products` `/ex63/cart` | `ex63-server.js` | 3005 | Session cart + MongoDB |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Angular CLI >= 21
- MongoDB running locally on `mongodb://localhost:27017`

### Install dependencies

```bash
npm install
```

### Run Angular dev server

```bash
npm start
# → http://localhost:4200
```

### Run a back-end server

Each exercise has its own server file in `server/`:

```bash
node server/ex60-server.js   # Cookies demo      → :3002
node server/ex61-server.js   # Cookie login      → :3003
node server/ex62-server.js   # Session demo      → :3004
node server/ex63-server.js   # Shopping cart     → :3005
node server/momo-server.js   # MoMo payment      → :3030
```

### Seed shopping cart products (Ex63)

Scrapes real product data from fakestoreapi.com into MongoDB:

```bash
node server/ex63-seed.js
```

---

## Exercise Details

### Ex60 – Cookies Programming (port 3002)

Demonstrates cookie-parser basics.

| Endpoint | Description |
|---|---|
| `GET /create-cookie` | Set username, password, account cookies + timed cookies |
| `GET /read-cookie` | Read cookies with null-check guard |
| `GET /clear-cookie` | Clear the account cookie |

### Ex61 – Cookie Login (port 3003)

Stores login credentials in a cookie (7-day expiry). Pre-fills the login form on next visit.

| Endpoint | Description |
|---|---|
| `POST /ex61/login` | Authenticate against FashionData.User, set cookie |
| `GET /ex61/read-cookie` | Return saved cookie info for pre-fill |
| `POST /ex61/logout` | Clear login cookies |

Sample accounts: `tranduythanh/123456` · `admin/admin@123` · `student/student1`

### Ex62 – Session Programming (port 3004)

Demonstrates express-session basics.

| Endpoint | Description |
|---|---|
| `GET /contact` | Visit counter stored in session |
| `GET /set-user` | Save a JsonObject to session |
| `GET /get-user` | Read the JsonObject back |
| `GET /reset-session` | Destroy the session |
| `GET /session-info` | Inspect full session (debug) |

### Ex63 – Session Shopping Cart (port 3005)

Session-based cart; product data seeded from fakestoreapi.com.

| Endpoint | Description |
|---|---|
| `GET /ex63/products` | List all products from FashionData.Product |
| `POST /ex63/cart/add` | Add product to session cart (auto-increment qty) |
| `GET /ex63/cart` | View current session cart |
| `PUT /ex63/cart/update` | Update qty (qty <= 0 removes item) |
| `DELETE /ex63/cart/remove/:id` | Remove one item |
| `DELETE /ex63/cart/clear` | Empty the cart |

---

## MongoDB Collections (FashionData)

| Collection | Used by | Fields |
|---|---|---|
| `User` | Ex61 | username, password |
| `Product` | Ex63 | name, price, image, description, category, rating, ratingCount |

---

## Technologies

| Layer | Stack |
|---|---|
| Frontend | Angular 21, TypeScript, RxJS, Angular Router, HttpClient |
| Backend | Node.js, Express 5, cors, cookie-parser, express-session |
| Database | MongoDB, Mongoose |
| Styling | CSS3, Space Grotesk / Space Mono (Google Fonts) |
| Data | fakestoreapi.com (product scraping) |

---

## Author

**Do Minh Nhat** · https://github.com/mnhatdo
