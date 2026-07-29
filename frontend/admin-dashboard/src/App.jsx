import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuthStore } from './store/adminAuthStore';
import AdminSidebar from './components/AdminSidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import CategoriesFoods from './pages/CategoriesFoods';
import DeliverySlots from './pages/DeliverySlots';
import Orders from './pages/Orders';
import PaymentsRefunds from './pages/PaymentsRefunds';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, admin } = useAdminAuthStore();
  if (!isAuthenticated || admin?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-base text-white">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/categories-foods" element={<CategoriesFoods />} />
                    <Route path="/slots" element={<DeliverySlots />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/payments-refunds" element={<PaymentsRefunds />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
