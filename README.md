# OrderU - Food Ordering System

An in-store food ordering system with three distinct platforms:

1. **Customer Platform** - For customers to browse menus, place orders, and track delivery
2. **Restaurant Platform** - For restaurant staff to manage menus, receive orders, and update order status
3. **Admin Platform** - For system administrators to manage restaurants, users, and overall system settings

## Project Structure

```
orderuv2/
├── customer-platform/  # Customer-facing food ordering app
├── restaurant-platform/ # Restaurant management application
├── admin-platform/     # Admin dashboard
└── shared/             # Shared utilities, components, and types
```

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies for all platforms:

```bash
# Install shared dependencies
npm install

# Install customer platform dependencies
cd customer-platform
npm install

# Install restaurant platform dependencies
cd ../restaurant-platform
npm install

# Install admin platform dependencies
cd ../admin-platform
npm install
```

### Running the development servers

```bash
# Start customer platform
cd customer-platform
npm run dev

# Start restaurant platform
cd ../restaurant-platform
npm run dev

# Start admin platform
cd ../admin-platform
npm run dev
```

## Features

### Customer Platform
- Browse restaurants and menus
- Place and customize orders
- Track order status
- Manage profile and saved addresses
- View order history

### Restaurant Platform
- Manage menu items and categories
- Receive and process orders
- Update order status
- View analytics and reports
- Manage restaurant profile and settings

### Admin Platform
- Manage restaurants
- User management
- System-wide settings
- Analytics and reporting

## Technologies

- React
- TypeScript
- TailwindCSS
- Vite
- React Router
