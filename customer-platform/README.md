# OrderU Customer Platform

This is the customer-facing web application for OrderU, a food delivery platform. The application is built with React, TypeScript, and TailwindCSS.

## Features

- View and search for restaurants
- Browse restaurant menus
- Place food orders
- Track order status
- Manage user profile and addresses
- View order history

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/orderuv2.git
cd orderuv2/customer-platform
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

The application will be available at http://localhost:3000.

## Project Structure

```
customer-platform/
├── public/                 # Static files
├── src/                    # Source code
│   ├── assets/             # Images, fonts, and other assets
│   │   ├── shared/         # Shared components used across the app
│   │   ├── web/            # Web-specific components
│   │   └── mobile/         # Mobile-specific components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── index.ts            # Entry point
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## Design System

The application uses a custom design system based on TailwindCSS with a color palette centered around:

- Primary: `#00A1C2` (with various shades)
- Secondary teal: `#00819C`
- Light blue: `#00C1E8`

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

This project is proprietary and confidential.
