// Core entity models
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
  linkedEntities?: string[]
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
}

// Entity Management
export interface EntityData extends BaseEntity {
  name: string
  type: 'Corporation' | 'LLC' | 'Partnership' | 'Trust' | 'Foundation' | 'Branch' | 'Representative Office'
  registrationNumber: string
  jurisdiction: string
  incorporationDate: string
  status: 'active' | 'inactive' | 'dissolved' | 'suspended'
  description: string
  address: string
  directors: string[]
  shareholders: string[]
  authorizedCapital: number
  paidUpCapital: number
  businessActivities: string[]
  complianceStatus: 'compliant' | 'non_compliant' | 'review_required'
  documentUrl?: string
  tags?: string[]
}

// Contract Management  
export interface ContractData extends BaseEntity {
  title: string
  type: 'NDA' | 'Service Agreement' | 'Employment' | 'Lease' | 'Purchase' | 'Partnership' | 'Licensing' | 'Other'
  counterparty: string
  value: number
  currency: string
  startDate: string
  endDate?: string
  status: 'draft' | 'under_review' | 'executed' | 'expired' | 'terminated'
  description: string
  keyTerms: string[]
  renewalDate?: string
  notificationPeriod?: number
  autoRenewal: boolean
  governing_law: string
  documentUrl?: string
  tags?: string[]
}

// Dispute Management
export interface DisputeData extends BaseEntity {
  title: string
  type: 'Litigation' | 'Arbitration' | 'Mediation' | 'Administrative' | 'Employment' | 'Commercial' | 'IP'
  description: string
  claimant: string
  respondent: string
  disputeValue: number
  currency: string
  status: 'filed' | 'discovery' | 'trial' | 'settlement' | 'judgment' | 'appeal' | 'closed'
  court: string
  caseNumber: string
  filingDate: string
  nextHearing?: string
  lawyer: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  outcome?: string
  settlementAmount?: number
  documentUrl?: string
  tags?: string[]
}

// Matter Management
export interface MatterData extends BaseEntity {
  title: string
  type: 'Corporate' | 'Litigation' | 'Employment' | 'Real Estate' | 'IP' | 'Tax' | 'Regulatory' | 'Compliance'
  client: string
  description: string
  status: 'open' | 'in_progress' | 'on_hold' | 'closed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedLawyer: string
  openDate: string
  closeDate?: string
  budgetAmount: number
  actualCost: number
  billingRate: number
  timeSpent: number
  nextAction?: string
  nextActionDate?: string
  documentUrl?: string
  tags?: string[]
}

// Risk Management
export interface RiskData extends BaseEntity {
  title: string
  type: 'Legal' | 'Compliance' | 'Operational' | 'Financial' | 'Reputational' | 'Regulatory' | 'Contractual'
  description: string
  category: 'Litigation' | 'Regulatory' | 'Data Privacy' | 'Employment' | 'Commercial' | 'IP' | 'Environmental'
  probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  impact: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  status: 'identified' | 'assessed' | 'mitigated' | 'monitored' | 'closed'
  owner: string
  mitigationStrategy: string
  mitigationActions: string[]
  residualRisk: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  reviewDate: string
  documentUrl?: string
  tags?: string[]
}

// Policy Management
export interface PolicyData extends BaseEntity {
  title: string
  type: 'Corporate Policy' | 'Privacy Policy' | 'Compliance Policy' | 'Ethical Policy' | 'Security Policy' | 'HR Policy'
  description: string
  category: 'Governance' | 'Data Protection' | 'Ethics' | 'Financial Crime' | 'Security' | 'Human Resources' | 'Operations'
  version: string
  status: 'draft' | 'active' | 'review' | 'expired'
  effectiveDate: string
  expiryDate?: string
  approver: string
  department: string
  compliance: 'compliant' | 'non_compliant' | 'review_required' | 'pending'
  documentUrl?: string
  tags?: string[]
}

// Knowledge Management
export interface KnowledgeData extends BaseEntity {
  title: string
  type: 'Legal Memo' | 'Case Brief' | 'Research Note' | 'Template' | 'Procedure' | 'Precedent' | 'FAQ'
  content: string
  category: 'Corporate Law' | 'Employment Law' | 'IP Law' | 'Tax Law' | 'Regulatory' | 'Litigation' | 'Compliance'
  author: string
  status: 'draft' | 'published' | 'archived' | 'under_review'
  keywords: string[]
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted'
  lastReviewed: string
  reviewedBy: string
  attachments?: string[]
  tags?: string[]
}

// Licensing & Regulatory
export interface LicenseData extends BaseEntity {
  name: string
  type: 'Business License' | 'Professional License' | 'Regulatory Registration' | 'Financial License' | 'Operating Permit' | 'Environmental Permit'
  description: string
  authority: string
  licenseNumber: string
  jurisdiction: string
  issueDate: string
  expiryDate: string
  renewalDate?: string
  status: 'active' | 'pending' | 'renewal_required' | 'expired' | 'suspended'
  requirements?: string[]
  complianceStatus: 'compliant' | 'non_compliant' | 'review_required'
  documentUrl?: string
  cost?: number
  tags?: string[]
  autoRenewal?: boolean
  notifications?: string[]
}

// Outsourcing & Legal Spend
export interface OutsourcingData extends BaseEntity {
  vendor: string
  type: 'Law Firm' | 'Specialist Firm' | 'Boutique Firm' | 'Consultant' | 'Service Provider'
  description: string
  matterType: 'Corporate' | 'Litigation' | 'Employment' | 'Intellectual Property' | 'Real Estate' | 'Tax' | 'Regulatory'
  startDate: string
  endDate?: string
  budget?: number
  actualSpend?: number
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  partner?: string
  hourlyRate?: number
  retainer?: number
  invoiceFrequency: 'monthly' | 'quarterly' | 'project-based' | 'as-incurred'
  paymentTerms: string
  performanceRating?: number
  tags?: string[]
  invoices?: Array<{
    date: string
    amount: number
    status: 'paid' | 'pending' | 'overdue'
  }>
  metrics?: {
    costEfficiency: number
    timeToResolution: number
    clientSatisfaction: number
  }
}

// Task Management
export interface TaskData extends BaseEntity {
  title: string
  description: string
  category: 'Legal Research' | 'Contract Drafting' | 'Policy Review' | 'Regulatory Response' | 'Client Onboarding' | 'Due Diligence' | 'Compliance Review' | 'Document Review'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'overdue'
  assignee?: string
  assigneeEmail?: string
  dueDate: string
  estimatedHours?: number
  actualHours?: number
  progress: number
  relatedModule?: string
  relatedId?: string
  tags?: string[]
  dependencies?: string[]
  notes?: string
  completionDate?: string | null
  subtasks?: Array<{
    id: string
    title: string
    completed: boolean
  }>
}

// Document Management
export interface DocumentData extends BaseEntity {
  name: string
  type: 'Contract' | 'Legal Memo' | 'Court Filing' | 'Certificate' | 'Policy' | 'Agreement' | 'Report' | 'Other'
  description: string
  category: 'Corporate' | 'Litigation' | 'Employment' | 'IP' | 'Regulatory' | 'Compliance' | 'Administrative'
  status: 'draft' | 'final' | 'executed' | 'archived'
  fileUrl: string
  fileSize: number
  fileType: string
  uploadedBy: string
  version: string
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted'
  expiryDate?: string
  relatedEntity?: string
  relatedEntityId?: string
  tags?: string[]
}

// Client/Entity Management (Enhanced)
export interface ClientData extends BaseEntity {
  name: string
  type: 'Individual' | 'Corporation' | 'Government' | 'NGO' | 'SME' | 'Multinational'
  industry: string
  registrationNumber?: string
  taxId?: string
  contactPerson: string
  email: string
  phone: string
  address: string
  country: string
  status: 'active' | 'inactive' | 'prospect' | 'former'
  onboardingDate: string
  kycStatus: 'pending' | 'completed' | 'expired' | 'rejected'
  riskRating: 'low' | 'medium' | 'high' | 'critical'
  amlStatus: 'cleared' | 'pending' | 'flagged'
  retainerAmount?: number
  billingRate?: number
  paymentTerms: string
  notes?: string
  tags?: string[]
}

// User Management
export interface UserData extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'partner' | 'associate' | 'paralegal' | 'secretary' | 'clerk'
  department: string
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string
  phoneNumber?: string
  profileImage?: string
}

// Analytics and Reporting
export interface AnalyticsData {
  period: string
  metrics: {
    totalMatters: number
    activeContracts: number
    completedTasks: number
    totalRevenue: number
    billedHours: number
    clientSatisfaction: number
    riskExposure: number
    complianceScore: number
  }
  trends: {
    mattersByType: Record<string, number>
    revenueByMonth: Array<{ month: string; revenue: number }>
    taskCompletionRate: number
    averageResolutionTime: number
  }
}

// AI Service Responses
export interface AIResponse {
  success: boolean
  data?: any
  message?: string
  confidence?: number
  suggestions?: string[]
}

// Import/Export Types
export interface ImportResult {
  success: boolean
  imported: number
  errors: Array<{ row: number; error: string }>
  warnings: Array<{ row: number; warning: string }>
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel'
  includeMetadata: boolean
  dateRange?: {
    start: string
    end: string
  }
  fields?: string[]
}