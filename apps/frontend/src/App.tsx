import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import { MattersPage } from './pages/MattersPage'
import { ContractsPage } from './pages/ContractsPage'
import { ClientsPage } from './pages/ClientsPage'
import { AIChatPage } from './pages/AIChatPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ComponentShowcase } from './pages/ComponentShowcase'
import { CompliancePage } from './pages/CompliancePage'
import { RiskManagementPage } from './pages/RiskManagementPage'
import { DisputesPage } from './pages/DisputesPage'
import { EntityManagementPage } from './pages/EntityManagementPage'
import { KnowledgeManagementPage } from './pages/KnowledgeManagementPage'
import { PolicyManagementPage } from './pages/PolicyManagementPage'
import { LicensingRegulatoryPage } from './pages/LicensingRegulatoryPage'
import { OutsourcingLegalSpendPage } from './pages/OutsourcingLegalSpendPage'
import { TaskManagementPage } from './pages/TaskManagementPage'
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
        
        {/* 10 Core Legal Management Modules */}
        <Route path="/entity-management" element={<EntityManagementPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/disputes" element={<DisputesPage />} />
        <Route path="/matters" element={<MattersPage />} />
        <Route path="/risk-management" element={<RiskManagementPage />} />
        <Route path="/policy-management" element={<PolicyManagementPage />} />
        <Route path="/knowledge" element={<KnowledgeManagementPage />} />
        <Route path="/licensing-regulatory" element={<LicensingRegulatoryPage />} />
        <Route path="/outsourcing-spend" element={<OutsourcingLegalSpendPage />} />
        <Route path="/task-management" element={<TaskManagementPage />} />
        
        {/* Supporting Modules */}
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/ai" element={<AIChatPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/showcase" element={<ComponentShowcase />} />
        
        {/* Redirects and fallbacks */}
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}