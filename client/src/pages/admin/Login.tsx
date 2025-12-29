import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { useAdminAuth } from '../../contexts/AdminContext';
import { ASSETS } from '../../constants/assets';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginZustand = useAdminAuthStore((state) => state.login);
  const { login: loginContext } = useAdminAuth();
  const navigate = useNavigate();

  // Debug: Log component mount
  useEffect(() => {
    console.log('🔵 Login component mounted');
    return () => {
      console.log('🔴 Login component unmounted');
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const isAuthenticated = useAdminAuthStore.getState().isAuthenticated;
    const token = useAdminAuthStore.getState().token;
    if (isAuthenticated && token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 Form submitted!');
    console.log('📝 Credentials:', { username: credentials.username, hasPassword: !!credentials.password });
    
    if (!credentials.username || !credentials.password) {
      console.error('❌ Missing credentials');
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', { username: credentials.username });
      
      // Use relative URL since Vite proxy handles /api routes
      // The proxy in vite.config.ts forwards /api to http://localhost:5000
      const loginUrl = '/api/auth/login';
      
      console.log('📡 Calling login API:', loginUrl);
      console.log('📡 Full URL would be:', window.location.origin + loginUrl);
      
      // Call the real API endpoint
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.username, // API expects 'email' field
          password: credentials.password,
        }),
      });

      console.log('📡 Login response status:', response.status, response.statusText);
      console.log('📡 Login response ok:', response.ok);
      
      let data;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        if (!responseText) {
          console.error('❌ Empty response from server');
          setError('Empty response from server. Please try again.');
          setLoading(false);
          return;
        }
        
        data = JSON.parse(responseText);
        console.log('📦 Login response data:', data);
      } catch (jsonError: any) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        setError('Invalid response from server. Please check your connection.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Invalid username or password';
        console.error('❌ Login failed:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Check for successful login response
      if (data.status === true && data.token && data.user_data) {
        console.log('✅ Login successful!');
        console.log('👤 User data:', data.user_data);
        console.log('🎫 Token received:', data.token ? 'Yes' : 'No');
        
        // Store token and user in Zustand store
        const user = {
          id: data.user_data.id.toString(),
          email: data.user_data.email,
          first_name: data.user_data.first_name || '',
          last_name: data.user_data.last_name || '',
          role: (data.user_data.user_type === 'Admin' || data.user_data.user_type === 'admin') ? 'admin' : 'editor' as 'admin' | 'editor',
          is_active: data.user_data.is_active !== undefined ? Boolean(data.user_data.is_active) : true,
          user_type: data.user_data.user_type || 'Regular User', // Store original user_type
          allowed_cms_pages: data.user_data.allowed_cms_pages || null, // Store CMS page permissions
        };
        
        console.log('💾 Storing user in Zustand store:', user);
        loginZustand(user, data.token);
        
        // Wait a bit for Zustand persist to save
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Verify the store was updated
        const storeState = useAdminAuthStore.getState();
        console.log('🔍 Store state after login:', {
          hasUser: !!storeState.user,
          hasToken: !!storeState.token,
          isAuthenticated: storeState.isAuthenticated,
          userEmail: storeState.user?.email,
          tokenLength: storeState.token?.length
        });
        
        // Also login to AdminContext if needed
        try {
          await loginContext({ username: credentials.username, password: credentials.password });
        } catch (ctxErr) {
          // If AdminContext login fails, still proceed (it might use different auth)
          console.warn('⚠️ AdminContext login warning:', ctxErr);
        }
        
        // Use window.location for reliable redirect
        console.log('🚀 Redirecting to dashboard...');
        window.location.href = '/admin/dashboard';
      } else {
        console.error('❌ Invalid response structure:', {
          hasStatus: !!data.status,
          statusValue: data.status,
          hasToken: !!data.token,
          hasUserData: !!data.user_data
        });
        setError('Invalid response from server. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ Login error caught:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={ASSETS.LOGOS.MAIN}
                alt="3i MedTech"
                className="object-contain"
                style={{ width: '120px', height: '120px', minWidth: '120px', minHeight: '120px' }}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm">Sign in to access the dashboard</p>
          </div>

          {/* Login Form */}
          <form 
            onSubmit={(e) => {
              console.log('📋 Form onSubmit triggered');
              handleSubmit(e);
            }} 
            className="space-y-5" 
            noValidate
          >
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-user-line text-gray-400"></i>
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-red-500 mr-2"></i>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="button"
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Button clicked!');
                
                if (!credentials.username || !credentials.password) {
                  setError('Please enter both username and password');
                  return;
                }
                
                // Manually trigger form submit
                const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                const form = e.currentTarget.closest('form');
                if (form) {
                  await handleSubmit(formEvent as any);
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-blue-400 disabled:to-teal-400 text-white font-medium py-2.5 px-4 rounded-md transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <i className="ri-login-box-line mr-2"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2024 3imedtech Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
