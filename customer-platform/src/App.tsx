import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="/cuisines" element={<div>Cuisines Page (Coming Soon)</div>} />
        <Route path="/cuisines/:id" element={<div>Cuisine Detail Page (Coming Soon)</div>} />
        <Route path="/cart" element={<div>Cart Page (Coming Soon)</div>} />
        <Route path="/checkout" element={<div>Checkout Page (Coming Soon)</div>} />
        <Route path="/orders" element={<div>Orders Page (Coming Soon)</div>} />
        <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
        <Route path="/about" element={<div>About Page (Coming Soon)</div>} />
        <Route path="/offers" element={<div>Offers Page (Coming Soon)</div>} />
        <Route path="/privacy-policy" element={<div>Privacy Policy (Coming Soon)</div>} />
        <Route path="/terms" element={<div>Terms & Conditions (Coming Soon)</div>} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
