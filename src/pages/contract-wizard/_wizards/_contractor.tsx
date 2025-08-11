import React, { useState } from 'react'
import { FileText, DollarSign, Target, CreditCard, FileCheck, Crown } from 'lucide-react'
import ContractorProposals from '@/pages/proposals/_contractor'
import ContractorContracts from '../_contractorContracts'
import InvoiceGenerator from '@/components/wizardTools/invoiceGenerator'
import Form1099NECGenerator from '@/components/wizardTools/NECTax1099'


const ContractorWizard = () => {
  const [activeTab, setActiveTab] = useState('contracts')

  const tabs = [
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'proposals', label: 'Proposals', icon: DollarSign },
    { id: 'invoices', label: 'Invoice Generator', icon: FileText },
    { id: 'export', label: 'File 1099 Tax Form', icon: FileCheck }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'contracts':
        return <ContractorContracts />
      case 'proposals':
        return <ContractorProposals />
      case 'invoices':
        return <InvoiceGenerator />
      case 'export':
        return <Form1099NECGenerator />
      default:
        return <ContractorContracts />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-boldblue mb-2 flex items-center gap-2">Contract Wizard <Crown /></h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div>
            <nav className="flex space-x-8 " aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-boldblue text-boldblue'
                        : 'border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-200">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default ContractorWizard