import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Clock,
  ShoppingBag,
  CreditCard,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout, admin } = useAdminAuthStore();

  const links = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Restaurants', path: '/restaurants', icon: UtensilsCrossed },
    { label: 'Categories & Menu', path: '/categories-foods', icon: Layers },
    { label: 'Delivery Slots', path: '/slots', icon: Clock },
    { label: 'Order Pipeline', path: '/orders', icon: ShoppingBag },
    { label: 'Payments & Refunds', path: '/payments-refunds', icon: CreditCard }
  ];

  return (
    <aside className="w-64 bg-surface border-r border-white/10 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-red-primary flex items-center justify-center font-display font-extrabold text-white text-xl shadow-red-glow">
            C
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white">Chrono<span className="text-red-primary">Admin</span></h1>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-primary text-white shadow-red-glow'
                      : 'text-textSecondary hover:bg-elevated hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-white/10 bg-elevated/50">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[11px] text-textMuted truncate">{admin?.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-lg bg-surface hover:bg-red-soft text-textMuted hover:text-red-primary transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
