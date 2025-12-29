import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard,
    FileText,
    Package,
    FolderTree,
    Image,
    Settings,
    Activity,
    LogOut,
    Menu,
    X,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, label: 'Pages', path: '/admin/pages' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
    { icon: Image, label: 'Media', path: '/admin/media' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Activity, label: 'Activity Logs', path: '/admin/activity' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">3i MedTech CMS</h1>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold">{user?.username?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Welcome back, <span className="font-semibold">{user?.username}</span>
                            </span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
