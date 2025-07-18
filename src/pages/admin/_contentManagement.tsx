import CategoryManagement from '@/components/admin/contentManagement/category'
import LegalContent from '@/components/admin/contentManagement/legalContent'
import React, { useState } from 'react'

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('categories')

  const tabs = [
    { id: 'categories', label: 'Manage Categories', component: <CategoryManagement /> },
    { id: 'legal', label: 'Manage Legal Contents', component: <LegalContent /> }
  ]

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Content Management</h1>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 cursor-pointer text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-boldblue border-boldblue bg-boldblue/5'
                  : 'text-gray-500 border-transparent hover:text-boldblue hover:border-boldblue/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <section className="min-h-[400px]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </section>
    </main>
  )
}

export default ContentManagement