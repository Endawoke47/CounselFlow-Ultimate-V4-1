import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayoutNew';
import { LoginPage } from './pages/LoginPage';
import Dashboard from './pages/DashboardNew';
import { MattersPageNew } from './pages/MattersPageNew';
import { ContractsPageNew } from './pages/ContractsPageNew';
import { ClientsPageNew } from './pages/ClientsPageNew';
import { DocumentsPage } from './pages/DocumentsPage';
import { AIChatPage } from './pages/AIChatPage';
import SettingsPage from './pages/SettingsPageNew';
import DocumentGenerator from './pages/DocumentGenerator';
import { IPManagementPage } from './pages/IPManagementPage';
import { CompliancePage } from './pages/CompliancePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DisputesPage } from './pages/DisputesPage';
import { SpendAnalyticsPage } from './pages/SpendAnalyticsPage';
import { IntakePage } from './pages/IntakePage';
import { EntityManagementPage } from './pages/EntityManagementPage';
import { KnowledgeManagementPage } from './pages/KnowledgeManagementPage';
import { ComponentShowcase } from './pages/ComponentShowcase';
import CalendarPage from './pages/CalendarPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matters" element={<MattersPageNew />} />
        <Route path="contracts" element={<ContractsPageNew />} />
        <Route path="clients" element={<ClientsPageNew />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="document-generator" element={<DocumentGenerator />} />
        <Route path="ai" element={<AIChatPage />} />
        <Route path="ip-management" element={<IPManagementPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="disputes" element={<DisputesPage />} />
        <Route path="spend-analytics" element={<SpendAnalyticsPage />} />
        <Route path="intake" element={<IntakePage />} />
        <Route path="entity-management" element={<EntityManagementPage />} />
        <Route path="knowledge" element={<KnowledgeManagementPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="showcase" element={<ComponentShowcase />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="App font-sans">
            <AppContent />
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
