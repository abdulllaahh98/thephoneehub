import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  Tag,
  ShieldAlert,
  LogOut,
  Menu,
  Bell,
  Search,
  User
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Smartphone },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Warranty Claims', path: '/admin/warranty-claims', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#1A3A5C] text-white">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-orange p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${isActive
                    ? 'bg-orange text-white shadow-lg shadow-orange/20'
                    : 'text-blue-200 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-red-300 font-black uppercase tracking-widest text-[11px] hover:bg-red-500/10 transition-all">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center flex-grow max-w-md bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full ml-3"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-orange transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-100"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-black text-gray-900 uppercase">Super Admin</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-grow overflow-y-auto p-8 bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
