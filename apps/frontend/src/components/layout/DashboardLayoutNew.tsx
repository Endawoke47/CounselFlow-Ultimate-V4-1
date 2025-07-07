import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AIAssistantButton } from '../ui/UIComponents';

interface NavigationItem {
  name: string;
  path: string;
  icon: string;
  category?: string;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [topBarDropdownOpen, setTopBarDropdownOpen] = useState(false);
  
  const topBarDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topBarDropdownRef.current && !topBarDropdownRef.current.contains(event.target as Node)) {
        setTopBarDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    console.log('Sign out clicked');
    logout();
  };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', category: 'Overview' },
    { name: 'Matters', path: '/matters', icon: '📁', category: 'Core' },
    { name: 'Contracts', path: '/contracts', icon: '📄', category: 'Core' },
    { name: 'Clients', path: '/clients', icon: '👥', category: 'Core' },
    { name: 'Documents', path: '/documents', icon: '📋', category: 'Core' },
    { name: 'AI Chat', path: '/ai', icon: '🤖', category: 'AI Tools' },
    { name: 'IP Management', path: '/ip-management', icon: '⚖️', category: 'Advanced' },
    { name: 'Compliance', path: '/compliance', icon: '🔒', category: 'Advanced' },
    { name: 'Privacy', path: '/privacy', icon: '🛡️', category: 'Advanced' },
    { name: 'Disputes', path: '/disputes', icon: '⚔️', category: 'Advanced' },
    { name: 'Spend Analytics', path: '/spend-analytics', icon: '💰', category: 'Analytics' },
    { name: 'Intake', path: '/intake', icon: '📥', category: 'Process' },
    { name: 'Entity Management', path: '/entity-management', icon: '🏢', category: 'Advanced' },
    { name: 'Knowledge Mgmt', path: '/knowledge', icon: '🧠', category: 'Advanced' },
    { name: 'Settings', path: '/settings', icon: '⚙️', category: 'System' },
  ];

  const groupedNavigation = navigation.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex bg-light-gray overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black opacity-25" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        flex-shrink-0 w-72 bg-primary h-full transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative lg:block z-50 lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 bg-primary-700 border-b border-primary-600 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="relative w-11 h-11 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20 backdrop-blur-sm">
                {/* Modern CF Logo */}
                <div className="relative flex items-center justify-center w-full h-full">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/30 rounded-2xl animate-pulse"></div>
                  
                  {/* CF Typography with modern styling */}
                  <div className="relative z-20 flex items-center">
                    <span className="font-extrabold text-xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tight">
                      C
                    </span>
                    <span className="font-extrabold text-xl bg-gradient-to-r from-accent-purple via-primary-600 to-primary-700 bg-clip-text text-transparent -ml-0.5">
                      F
                    </span>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-1 left-1 w-1 h-1 bg-primary-400 rounded-full opacity-60"></div>
                  <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-accent-purple rounded-full opacity-80"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl tracking-wide leading-tight">CounselFlow</span>
                <span className="text-primary-200 text-xs font-medium tracking-wider uppercase opacity-90">Legal AI Platform</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {Object.entries(groupedNavigation).map(([category, items]) => (
              <div key={category}>
                <h3 className="px-3 text-xs font-semibold text-primary-200 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${isActive(item.path)
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="w-6 h-6 mr-3 text-lg flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="truncate">{item.name}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-muted-gray shadow-sm flex-shrink-0 z-20">
          <div className="flex items-center justify-between h-full px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-dark-navy hover:bg-light-gray transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search matters, contracts, clients..."
                  className="block w-full pl-10 pr-3 py-2 border border-muted-gray rounded-lg bg-light-gray focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Quick actions and user menu */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <button className="p-2 text-dark-navy hover:bg-light-gray rounded-lg transition-colors group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>

              {/* Calendar */}
              <Link 
                to="/calendar"
                className={`relative p-2 rounded-lg transition-colors group ${
                  isActive('/calendar') 
                    ? 'text-primary bg-primary-50' 
                    : 'text-dark-navy hover:bg-light-gray'
                }`}
                title="Calendar"
              >
                <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {isActive('/calendar') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-dark-navy hover:bg-light-gray rounded-lg transition-colors group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-7a1 1 0 011-1h2a1 1 0 011 1v7z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full" />
              </button>

              {/* User Avatar */}
              <div className="relative" ref={topBarDropdownRef}>
                <button 
                  onClick={() => setTopBarDropdownOpen(!topBarDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-light-gray transition-all duration-200 group"
                >
                  <div className="relative w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:shadow-xl transition-all duration-200">
                    <span className="text-white font-bold text-sm">JD</span>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-dark-navy">John Doe</p>
                    <p className="text-xs text-muted-gray">Senior Partner</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-muted-gray group-hover:text-dark-navy transition-all duration-200 ${topBarDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {topBarDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-light-gray">
          <div className="animate-fade-in p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistantButton onClick={() => setAiAssistantOpen(true)} />

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-muted-gray lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center space-y-1 transition-colors
                ${isActive(item.path)
                  ? 'text-primary bg-primary-50'
                  : 'text-muted-gray hover:text-primary'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Assistant Panel */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setAiAssistantOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-floating transform animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-muted-gray bg-gradient-to-r from-primary-50 to-accent-purple/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">F</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-navy">Flow</h3>
                    <p className="text-xs text-muted-gray">AI Legal Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiAssistantOpen(false)}
                  className="p-2 text-muted-gray hover:text-dark-navy rounded-lg hover:bg-light-gray transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="bg-gradient-to-br from-primary via-primary-600 to-accent-purple rounded-xl p-4 text-white mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">⚡</span>
                    <h4 className="font-semibold">How can I help you today?</h4>
                  </div>
                  <p className="text-sm opacity-90">I specialize in legal research, contract drafting, document analysis, and strategic legal guidance.</p>
                </div>
                <div className="space-y-3">
                  <Link to="/ai" className="block">
                    <div className="w-full text-left p-3 rounded-lg border border-muted-gray hover:bg-light-gray transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <span className="text-primary text-lg">🔍</span>
                        </div>
                        <div>
                          <div className="font-medium text-dark-navy">Legal Research</div>
                          <div className="text-sm text-muted-gray">Find case law, statutes, and precedents</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/ai" className="block">
                    <div className="w-full text-left p-3 rounded-lg border border-muted-gray hover:bg-light-gray transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent-purple/20 rounded-lg flex items-center justify-center group-hover:bg-accent-purple/30 transition-colors">
                          <span className="text-accent-purple text-lg">📄</span>
                        </div>
                        <div>
                          <div className="font-medium text-dark-navy">Draft Contracts</div>
                          <div className="text-sm text-muted-gray">Generate professional legal agreements</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/ai" className="block">
                    <div className="w-full text-left p-3 rounded-lg border border-muted-gray hover:bg-light-gray transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center group-hover:bg-success/30 transition-colors">
                          <span className="text-success text-lg">📊</span>
                        </div>
                        <div>
                          <div className="font-medium text-dark-navy">Analyze Documents</div>
                          <div className="text-sm text-muted-gray">Review and extract key insights</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/ai" className="block">
                    <div className="w-full text-left p-3 rounded-lg border border-muted-gray hover:bg-light-gray transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center group-hover:bg-warning/30 transition-colors">
                          <span className="text-warning text-lg">💬</span>
                        </div>
                        <div>
                          <div className="font-medium text-dark-navy">Legal Consultation</div>
                          <div className="text-sm text-muted-gray">Get strategic legal guidance</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="mt-6 p-3 bg-light-gray rounded-lg">
                  <div className="text-xs text-muted-gray text-center">
                    <span className="font-medium">Flow</span> is powered by advanced AI and provides general guidance. Always consult with qualified legal counsel for specific legal advice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
