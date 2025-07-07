import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Scale, 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  FileText, 
  Users, 
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Shield,
  Building,
  Archive,
  Brain,
  TrendingUp,
  Gavel,
  Inbox,
  Database,
  Plus,
  Grid3X3,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SimpleSignOut } from '../SimpleSignOut'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSidebarUserMenu, setShowSidebarUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  console.log('DashboardLayout rendered, user:', user)

  // Close dropdowns when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.user-menu-container')) {
      setShowUserMenu(false)
    }
    if (!target.closest('.sidebar-user-menu-container')) {
      setShowSidebarUserMenu(false)
    }
    if (!target.closest('.notifications-container')) {
      setShowNotifications(false)
    }
    if (!target.closest('.quick-actions-container')) {
      setShowQuickActions(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Matters', href: '/matters', icon: Briefcase },
    { name: 'Contracts', href: '/contracts', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Documents', href: '/documents', icon: Archive },
    { name: 'AI Assistant', href: '/ai', icon: MessageSquare },
    { name: 'Legal Intake', href: '/intake', icon: Inbox },
    { name: 'IP Management', href: '/ip-management', icon: Shield },
    { name: 'Entity Management', href: '/entity-management', icon: Building },
    { name: 'Compliance', href: '/compliance', icon: Scale },
    { name: 'Privacy & Data', href: '/privacy', icon: Shield },
    { name: 'Disputes', href: '/disputes', icon: Gavel },
    { name: 'Spend Analytics', href: '/spend-analytics', icon: TrendingUp },
    { name: 'Knowledge Base', href: '/knowledge', icon: Database },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const quickActions = [
    { name: 'New Client', action: () => navigate('/clients'), icon: Users },
    { name: 'New Matter', action: () => navigate('/matters'), icon: Briefcase },
    { name: 'New Contract', action: () => navigate('/contracts'), icon: FileText },
    { name: 'AI Assist', action: () => navigate('/ai'), icon: Brain },
  ]

  const notifications = [
    { id: 1, title: 'Contract Review Due', message: 'TechCorp Agreement expires in 3 days', type: 'warning', time: '2h ago' },
    { id: 2, title: 'New Client Inquiry', message: 'StartupCo requesting consultation', type: 'info', time: '4h ago' },
    { id: 3, title: 'Payment Received', message: '$15,000 payment processed', type: 'success', time: '6h ago' },
  ]

  const handleLogout = async () => {
    console.log('Logout button clicked')
    try {
      await logout()
      console.log('Logout completed, navigating to login')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-professional">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-teal shadow-floating lg:hidden"
            >
              <div className="flex items-center justify-between px-gutter py-6 border-b border-white/20">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-white" />
                  <span className="text-xl font-bold text-white gradient-text-white">CounselFlow</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  icon={X}
                  className="text-white hover:bg-white/20"
                />
              </div>
              <nav className="px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                        isActive
                          ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
                      )}
                    >
                      <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* WORKING Mobile Sidebar User Profile Section */}
              <div className="px-4 pb-4 mt-auto">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🟢 MOBILE SIDEBAR USER MENU CLICKED!')
                      setShowSidebarUserMenu(!showSidebarUserMenu)
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group"
                    style={{ zIndex: 1000 }}
                  >
                    <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                      </div>
                      <div className="text-xs text-white text-opacity-60">
                        {user?.title || 'Senior Partner'}
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white text-opacity-60 transition-transform ${
                      showSidebarUserMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showSidebarUserMenu && (
                    <div 
                      className="absolute bottom-full left-0 right-0 mb-2"
                      style={{ zIndex: 1001 }}
                    >
                      <Card variant="glass" className="py-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('🟢 MOBILE SIDEBAR LOGOUT CLICKED!')
                            alert('Mobile sidebar logout working!')
                            handleLogout()
                            setSidebarOpen(false)
                            setShowSidebarUserMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors rounded-lg"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - Fixed with CounselFlow primary teal background */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-teal border-r border-primary-600 shadow-floating">
          <div className="flex items-center flex-shrink-0 px-gutter py-6">
            <Scale className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white gradient-text-white">CounselFlow</span>
          </div>
          <div className="mt-4 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
                    )}
                  >
                    <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            
            {/* WORKING Sidebar User Profile Section */}
            <div className="px-4 pb-4 mt-auto">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('🟢 SIDEBAR USER MENU CLICKED!')
                    setShowSidebarUserMenu(!showSidebarUserMenu)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group"
                  style={{ zIndex: 1000 }}
                >
                  <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">
                      {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                    </div>
                    <div className="text-xs text-white text-opacity-60">
                      {user?.title || 'Senior Partner'}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white text-opacity-60 transition-transform ${
                    showSidebarUserMenu ? 'rotate-180' : ''
                  }`} />
                </button>

                {showSidebarUserMenu && (
                  <div 
                    className="absolute bottom-full left-0 right-0 mb-2"
                    style={{ zIndex: 1001 }}
                  >
                    <Card variant="glass" className="py-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('🟢 SIDEBAR LOGOUT CLICKED!')
                          alert('Sidebar logout working!')
                          handleLogout()
                          setShowSidebarUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors rounded-lg"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:pl-72">
        {/* Enhanced Topbar - Clean white background with professional spacing */}
        <header className="bg-white/90 backdrop-blur-md border-b border-primary-200 px-4 lg:px-gutter py-4 shadow-soft sticky top-0 z-30">
          <div className="flex items-center justify-between max-w-app mx-auto">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                icon={Menu}
                className="lg:hidden text-primary-900"
              />
              
              {/* Enhanced Search Bar */}
              <div className="ml-4 lg:ml-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                  <input
                    type="text"
                    placeholder="Search matters, contracts, clients..."
                    className="pl-10 pr-4 py-3 w-64 lg:w-96 border border-primary-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-primary-900 placeholder-primary-500 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick Actions Speed Dial */}
              <div className="relative quick-actions-container">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    icon={Plus}
                    className="text-primary-600 hover:bg-primary-50"
                  />
                </motion.div>

                <AnimatePresence>
                  {showQuickActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-floating border border-primary-200 py-2 z-50"
                    >
                      {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <button
                            key={action.name}
                            onClick={() => {
                              action.action()
                              setShowQuickActions(false)
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-primary-900 hover:bg-primary-50 transition-all duration-200"
                          >
                            <Icon className="h-4 w-4 mr-3 text-primary-600" />
                            {action.name}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Notification Bell */}
              <div className="relative notifications-container">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setShowNotifications(!showNotifications)}
                    icon={Bell}
                    className="text-primary-900 hover:bg-primary-50 relative"
                  />
                  <motion.span 
                    className="absolute -top-1 -right-1 h-3 w-3 bg-danger rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-floating border border-primary-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-primary-200">
                        <h3 className="text-sm font-semibold text-primary-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="px-4 py-3 hover:bg-primary-50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className={cn(
                                'w-2 h-2 rounded-full mt-2',
                                notification.type === 'warning' ? 'bg-warning' :
                                notification.type === 'success' ? 'bg-success' : 'bg-info'
                              )} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-primary-900">{notification.title}</p>
                                <p className="text-xs text-primary-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-primary-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ULTRA SIMPLE TEST USER MENU */}
              <div>
                <button
                  onMouseDown={(e) => {
                    console.log('🔥 MOUSE DOWN EVENT FIRED!')
                    setShowUserMenu(!showUserMenu)
                  }}
                  onMouseUp={() => console.log('� MOUSE UP EVENT FIRED!')}
                  onTouchStart={() => console.log('🔥 TOUCH START EVENT FIRED!')}
                  style={{
                    background: 'orange',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 999999
                  }}
                >
                  ⚡ John Doe {showUserMenu ? '▲' : '▼'}
                </button>

                {showUserMenu && (
                  <div 
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      marginTop: '8px',
                      background: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '8px 0',
                      minWidth: '200px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 999999
                    }}
                  >
                    <button
                      onMouseDown={() => {
                        console.log('� LOGOUT BUTTON MOUSE DOWN!')
                        alert('LOGOUT CLICKED!')
                        handleLogout()
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'white',
                        color: 'red',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* HIDDEN ORIGINAL MENUS */}
              <div style={{ display: 'none' }}>
                <motion.button
                  onClick={() => {
                    console.log('User menu clicked, current state:', showUserMenu)
                    setShowUserMenu(!showUserMenu)
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-light-gray transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-dark-navy group-hover:text-primary transition-colors">
                    {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                  </span>
                  <ChevronDown className={`hidden lg:block h-4 w-4 text-muted-gray group-hover:text-primary transition-all duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-soft-white rounded-lg shadow-counsel-lg border border-muted-gray py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-muted-gray">
                        <div className="text-sm font-medium text-dark-navy">
                          {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                        </div>
                        <div className="text-xs text-muted-gray">
                          {user?.email || 'john.doe@lawfirm.com'}
                        </div>
                        <div className="text-xs text-muted-gray">
                          {user?.title || 'Senior Partner'}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-dark-navy hover:bg-light-gray transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-3 text-primary" />
                        View Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-dark-navy hover:bg-light-gray transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-primary" />
                        Settings
                      </Link>
                      <hr className="my-2 border-muted-gray" />
                      <button
                        onClick={() => {
                          console.log('Top bar Sign Out clicked')
                          handleLogout()
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-danger hover:bg-light-gray transition-colors font-medium"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main content with proper spacing and max width */}
        <main className="py-gutter">
          <div className="max-w-app mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}