# Advanced Web Exercises

A collection of advanced Angular exercises demonstrating modern web development practices with a retro-inspired UI design.

## 🎯 Exercises Overview

This repository contains hands-on Angular exercises covering various advanced topics:

### Ex13: Product Service with Images and Events
- Service-based architecture
- Image handling
- Event-driven components
- Product detail views

### Ex14: Catalog Service
- Category-based product organization
- Service integration
- Dynamic data rendering

### Ex18: Customer Grouping
- Data filtering and grouping
- Customer management interface
- Advanced component patterns

### Ex50: RESTful API Book Management ⭐
- Complete CRUD operations (Create, Read, Update, Delete)
- RESTful API simulation with HttpClient
- Book information management system
- Image upload handling
- Form validation and user experience
- Features:
  - ✅ View all books in a styled table
  - ✅ Create new book entries
  - ✅ Edit existing book information
  - ✅ View detailed book information
  - ✅ Delete books with confirmation
  - ✅ Image preview and upload

## 🎨 Design System

The application features a **retro 2000s-inspired design system** with:

- **Minimalist black & white color scheme**
- **Bold typography** using Space Grotesk and Space Mono fonts
- **Hard-edge shadows** and thick borders
- **Dotted halftone background patterns**
- **Window-style interfaces** with classic title bars
- **Interactive hover effects** and smooth transitions

### Design Components
- Retro cards with shadow effects
- Styled buttons with press animations
- Clean form inputs with focus states
- Professional data tables
- Tab-based navigation system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v21 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mnhatdo/advanced_web_exercises.git
   cd advanced_web_exercises
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── ex13/                   # Product Service Exercise
│   ├── ex14/                   # Catalog Service Exercise
│   ├── ex18/                   # Customer Grouping Exercise
│   ├── ex50/                   # Book Management (RESTful API)
│   │   ├── book.service.ts     # RESTful service with CRUD operations
│   │   ├── book-list/          # List all books
│   │   ├── book-form/          # Create/Edit books
│   │   └── book-details/       # View book details
│   ├── app.component.ts        # Main app with tab navigation
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts           # Routing configuration
├── styles.css                  # Global retro design system
└── public/
    └── assets/
        └── data/
            └── books.json      # Sample book data
```

## 🛠️ Technologies Used

- **Angular 21** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Angular Router** - Navigation and routing
- **HttpClient** - API communication
- **CSS3** - Modern styling with custom properties
- **Google Fonts** - Typography (Space Grotesk, Space Mono)

## 📱 Features

### Tab-based Navigation
Easy-to-extend tab system for adding new exercises:
```typescript
tabs: ExerciseTab[] = [
  { path: '/ex13/service-product-image-event', label: 'Ex13 Product', shortLabel: 'Ex13' },
  { path: '/ex14/catalog', label: 'Ex14 Catalog', shortLabel: 'Ex14' },
  { path: '/ex18/customer-grouping', label: 'Ex18 Customers', shortLabel: 'Ex18' },
  { path: '/ex50/books', label: 'Ex50 Books', shortLabel: 'Ex50' }
];
```

### RESTful API Simulation
The Book Management exercise simulates a complete RESTful API with:
- `GET /books` - Retrieve all books
- `POST /books` - Create new book
- `PUT /books/:id` - Update existing book
- `DELETE /books/:id` - Delete book

## 🎯 Learning Objectives

- **Component Architecture** - Building scalable Angular components
- **Service Patterns** - Implementing business logic in services
- **HTTP Communication** - Working with APIs and data
- **Routing & Navigation** - Multi-page application structure
- **Form Handling** - Template-driven and reactive forms
- **State Management** - Managing application state
- **UI/UX Design** - Creating engaging user interfaces
- **TypeScript** - Advanced typing and interfaces

## 📝 Exercise Guidelines

Each exercise is designed to be:
- **Hands-on** - Learn by building real features
- **Progressive** - Build upon previous concepts
- **Practical** - Solve real-world problems
- **Modern** - Use current Angular best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Do Minh Nhat**
- GitHub: [@mnhatdo](https://github.com/mnhatdo)

---

*Built with Angular 21 and modern web technologies* 🚀
├── angular.json                    # Angular configuration
├── package.json                    # Dependencies for all exercises
├── tsconfig.json                   # TypeScript configuration
├── node_modules/                   # Shared dependencies
├── public/                         # Shared static assets
│   └── assets/
│       ├── images/                 # Product images (ex13, ex14)
│       ├── avatars/                # Customer avatars (ex18)
│       └── data/                   # JSON data files (ex18)
└── src/
    ├── index.html                  # Single entry point
    ├── main.ts                     # Single bootstrap file
    ├── styles.css                  # Global styles
    └── app/
        ├── app.component.ts        # Root component with navigation
        ├── app.config.ts           # Application configuration
        ├── app.routes.ts           # Centralized routing
        ├── ex13/                   # Exercise 13 feature folder
        │   ├── product.service.ts
        │   ├── service-product-image-event/
        │   └── service-product-image-event-detail/
        ├── ex14/                   # Exercise 14 feature folder
        │   ├── catalog.service.ts
        │   └── ex14-catalog/
        └── customer-grouping/      # Exercise 18 feature folder
            └── customer-grouping.component.*
```

## Exercises

### Ex13: Product Service with Images and Events
- **Routes:** `/ex13/service-product-image-event`, `/ex13/service-product-image-event/:id`
- **Features:** Product listing, product detail view, navigation events
- **Service:** ProductService with 3 products (Coca, Pepsi, Sting)

### Ex14: Catalog Service
- **Route:** `/ex14/catalog`
- **Features:** Category-based product display
- **Service:** CatalogService with 2 categories (Nước ngọt, Bia)

### Ex18: Customer Grouping
- **Route:** `/ex18/customer-grouping` (default)
- **Features:** Customer grouping by type, HTTP data loading
- **Data Source:** `assets/data/customers.json`

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm start
# Navigate to http://localhost:4200/
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Architecture Rules

### ✅ Allowed
- Create new exercise folders under `src/app/`
- Add routes to `app.routes.ts` with unique prefixes
- Create services within exercise folders
- Share assets via `public/assets/`

### ❌ Forbidden
- Multiple `angular.json` files
- Multiple `main.ts` or bootstrap files
- Nested Angular apps inside exercises
- Exercise-level `node_modules` or `package.json`

## Adding New Exercises

1. Create a new folder: `src/app/ex{number}/`
2. Create components and services inside
3. Add routes to `app.routes.ts` with prefix: `/ex{number}/...`
4. Update navigation in `app.component.ts`
5. Place shared assets in `public/assets/`

## Route Prefixes

Each exercise uses a unique route prefix to prevent conflicts:
- **Ex13:** `/ex13/*`
- **Ex14:** `/ex14/*`
- **Ex18:** `/ex18/*`

## Migration Notes

This workspace was consolidated from multiple separate Angular apps:
- `ex18/` → Root Angular app
- `e14/my-exer/` → Migrated to `src/app/ex14/`
- `e14/my-app/` → Removed (unused)

All exercises now run under a single Angular application with shared dependencies and unified routing.
