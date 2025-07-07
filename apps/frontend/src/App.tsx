import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import Dashboard from './pages/DashboardNew'
import { MattersPage } from './pages/MattersPageUpdated'
import { ContractsPage } from './pages/ContractsPageUpdated'
import { ClientsPage } from './pages/ClientsPageUpdated'
import { AIChatPage } from './pages/AIChatPage'
import { DocumentsPage } from './pages/DocumentsPageUpdated'
import { SettingsPage } from './pages/SettingsPageUpdated'
import { ComponentShowcase } from './pages/ComponentShowcase'
import { IPManagementPage } from './pages/IPManagementPage'
import { CompliancePage } from './pages/CompliancePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { DisputesPage } from './pages/DisputesPage'
import { SpendAnalyticsPage } from './pages/SpendAnalyticsPageNew'
import { IntakePage } from './pages/IntakePageNew'
import { EntityManagementPage } from './pages/EntityManagementPage'
import { KnowledgeManagementPage } from './pages/KnowledgeManagementPageNew'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

export function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matters" element={<MattersPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/ai" element={<AIChatPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/ip-management" element={<IPManagementPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/disputes" element={<DisputesPage />} />
        <Route path="/spend-analytics" element={<SpendAnalyticsPage />} />
        <Route path="/intake" element={<IntakePage />} />
        <Route path="/entity-management" element={<EntityManagementPage />} />
        <Route path="/knowledge" element={<KnowledgeManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/showcase" element={<ComponentShowcase />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}