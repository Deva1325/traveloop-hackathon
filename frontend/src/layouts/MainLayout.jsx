import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  Wallet, 
  FileText, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'My Trips', icon: Map, href: '/trips' },
  { label: 'Create Trip', icon: PlusCircle, href: '/trips/new' },
  { label: 'Budget', icon: Wallet, href: '/budget' },
  { label: 'Notes', icon: FileText, href: '/notes' },
];

const BOTTOM_ITEMS = [
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card shadow-sm z-20">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Map className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Traveloop</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          {BOTTOM_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-destructive hover:bg-destructive/10 mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 ml-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <Map className="text-primary-foreground w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-primary">Traveloop</span>
            </Link>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none">{user?.FullName || 'Traveler'}</p>
            </div>
            <img
              src={user?.ProfileImageUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
              alt="User"
              className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
              onClick={() => navigate('/profile')}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 bg-card h-full shadow-xl flex flex-col transform transition-transform animate-in slide-in-from-left">
            <div className="p-6 flex items-center justify-between border-b">
              <Link to="/" className="flex items-center gap-2">
                <Map className="text-primary w-6 h-6" />
                <span className="text-xl font-bold">Traveloop</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {[...SIDEBAR_ITEMS, ...BOTTOM_ITEMS].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
