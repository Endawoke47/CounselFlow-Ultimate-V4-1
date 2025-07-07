import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/UIComponents';

interface SettingsTab {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

const GeneralSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    firmName: 'CounselFlow Legal Partners',
    email: 'admin@counselflow.com',
    phone: '+1 (555) 123-4567',
    address: '123 Legal Plaza, Suite 400',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    website: 'https://counselflow.com',
    barNumber: 'NY123456789',
    jurisdiction: 'New York'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Firm Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Firm Name"
            value={formData.firmName}
            onChange={(e) => handleInputChange('firmName', e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
          <Input
            label="State"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
          <Input
            label="ZIP Code"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Legal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Bar Number"
            value={formData.barNumber}
            onChange={(e) => handleInputChange('barNumber', e.target.value)}
          />
          <Input
            label="Primary Jurisdiction"
            value={formData.jurisdiction}
            onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" className="px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    layout: 'comfortable',
    animations: true,
    sidebarCollapsed: false
  });

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Theme & Display</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-navy mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                className={`p-4 border rounded-lg transition-all ${
                  settings.theme === 'light' 
                    ? 'border-primary bg-primary-50' 
                    : 'border-muted-gray hover:border-primary'
                }`}
              >
                <div className="w-full h-20 bg-white border border-gray-200 rounded mb-2"></div>
                <span className="text-sm font-medium">Light Theme</span>
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                className={`p-4 border rounded-lg transition-all ${
                  settings.theme === 'dark' 
                    ? 'border-primary bg-primary-50' 
                    : 'border-muted-gray hover:border-primary'
                }`}
              >
                <div className="w-full h-20 bg-gray-800 border border-gray-600 rounded mb-2"></div>
                <span className="text-sm font-medium">Dark Theme</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-navy mb-3">Font Size</label>
            <div className="grid grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => setSettings(prev => ({ ...prev, fontSize: size }))}
                  className={`p-3 border rounded-lg transition-all capitalize ${
                    settings.fontSize === size
                      ? 'border-primary bg-primary-50'
                      : 'border-muted-gray hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-navy mb-3">Layout Density</label>
            <div className="grid grid-cols-2 gap-3">
              {['compact', 'comfortable'].map(layout => (
                <button
                  key={layout}
                  onClick={() => setSettings(prev => ({ ...prev, layout }))}
                  className={`p-3 border rounded-lg transition-all capitalize ${
                    settings.layout === layout
                      ? 'border-primary bg-primary-50'
                      : 'border-muted-gray hover:border-primary'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-dark-navy">Enable Animations</span>
              <p className="text-sm text-muted-gray">Smooth transitions and micro-interactions</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, animations: !prev.animations }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.animations ? 'bg-primary' : 'bg-muted-gray'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                settings.animations ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" className="px-8">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={securityData.currentPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
          />
          <Input
            label="New Password"
            type="password"
            value={securityData.newPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
          <Button variant="primary">Update Password</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Security Options</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-dark-navy">Two-Factor Authentication</span>
              <p className="text-sm text-muted-gray">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={securityData.twoFactorEnabled ? 'success' : 'warning'}>
                {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Button size="sm" variant="secondary">
                {securityData.twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-dark-navy">Login Notifications</span>
              <p className="text-sm text-muted-gray">Get notified when someone logs into your account</p>
            </div>
            <button
              onClick={() => setSecurityData(prev => ({ ...prev, loginNotifications: !prev.loginNotifications }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                securityData.loginNotifications ? 'bg-primary' : 'bg-muted-gray'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                securityData.loginNotifications ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-navy mb-2">Session Timeout</label>
            <select
              value={securityData.sessionTimeout}
              onChange={(e) => setSecurityData(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              className="w-32 px-3 py-2 border border-muted-gray rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" className="px-8">
          Save Security Settings
        </Button>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    contractReminders: true,
    deadlineAlerts: true,
    clientUpdates: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Notification Channels</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', description: 'Browser and mobile push notifications' },
            { key: 'sms', label: 'SMS Notifications', description: 'Text message notifications for urgent items' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-dark-navy">{item.label}</span>
                <p className="text-sm text-muted-gray">{item.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-primary' : 'bg-muted-gray'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-dark-navy mb-6">Notification Types</h3>
        <div className="space-y-4">
          {[
            { key: 'contractReminders', label: 'Contract Reminders', description: 'Alerts for contract renewals and expirations' },
            { key: 'deadlineAlerts', label: 'Deadline Alerts', description: 'Important deadline notifications' },
            { key: 'clientUpdates', label: 'Client Updates', description: 'New client messages and updates' },
            { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and maintenance notices' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates and promotional content' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-dark-navy">{item.label}</span>
                <p className="text-sm text-muted-gray">{item.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-primary' : 'bg-muted-gray'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" className="px-8">
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs: SettingsTab[] = [
    { id: 'general', name: 'General', icon: '⚙️', component: GeneralSettings },
    { id: 'appearance', name: 'Appearance', icon: '🎨', component: AppearanceSettings },
    { id: 'security', name: 'Security', icon: '🔒', component: SecuritySettings },
    { id: 'notifications', name: 'Notifications', icon: '🔔', component: NotificationSettings }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-navy">Settings</h1>
        <p className="text-muted-gray mt-1">Manage your account preferences and system configuration</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Vertical Tab Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="lg:sticky lg:top-24">
            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-dark-navy hover:bg-light-gray'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-muted-gray">
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  Export Data
                </Button>
                <Button variant="ghost" className="w-full text-danger">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
