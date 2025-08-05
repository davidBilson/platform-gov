import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  CreditCard,
  Download,
  Settings,
  Plus,
  Edit3,
  Eye,
  Lock,
  Crown,
  ChevronDown,
  Trash2,
  Save
} from 'lucide-react';
import LockedOverlay from '@/components/subscription/LockedOverlay';

const ContractWizardInterface = () => {
  const [isPremium, setIsPremium] = useState(true); // Toggle for demo
  const [activeTab, setActiveTab] = useState('milestones');
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Project Kickoff', amount: 2500, dueDate: '2024-09-15', status: 'pending' }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    amount: '',
    description: '',
    dueDate: ''
  });

  const tabs = [
    { id: 'milestones', label: 'Milestones', icon: Calendar },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Edit3 },
    { id: 'export', label: 'Export', icon: Download }
  ];

  const templates = [
    { value: 'standard', label: 'Standard Payment Terms' },
    { value: 'milestone', label: 'Milestone-Based Payment' },
    { value: 'recurring', label: 'Recurring Payment' },
    { value: 'retainer', label: 'Retainer Agreement' }
  ];

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: '',
      amount: '',
      dueDate: '',
      status: 'pending'
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id, field, value) => {
    setMilestones(milestones.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const deleteMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };


  const MilestonesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-darkgray">Project Milestones</h2>
        <button
          onClick={addMilestone}
          className="flex items-center gap-2 bg-boldblue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkgray mb-2">Title</label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
                  placeholder="Milestone title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-2">Amount</label>
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) => updateMilestone(milestone.id, 'amount', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-2">Due Date</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => deleteMilestone(milestone.id)}
                  className="p-2 text-crimson hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InvoicesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-darkgray">Invoice Generator</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-2">Client Name</label>
            <input
              type="text"
              value={invoiceData.clientName}
              onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
              placeholder="Enter client name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-2">Amount</label>
            <input
              type="number"
              value={invoiceData.amount}
              onChange={(e) => setInvoiceData({ ...invoiceData, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-darkgray mb-2">Description</label>
            <textarea
              value={invoiceData.description}
              onChange={(e) => setInvoiceData({ ...invoiceData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
              rows="3"
              placeholder="Service description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-2">Due Date</label>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex items-center gap-2 bg-boldblue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 bg-aquagreen text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );

  const TemplatesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-darkgray">Payment Templates</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-darkgray mb-2">Template Type</label>
          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-boldblue focus:border-transparent appearance-none"
            >
              {templates.map(template => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mediumgray pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-2">Payment Terms</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
              rows="4"
              defaultValue="Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly service charge."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-2">Late Fee Policy</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent"
              rows="3"
              defaultValue="Late fees of 1.5% per month will be applied to overdue amounts."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex items-center gap-2 bg-boldblue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
            <Save className="w-4 h-4" />
            Save Template
          </button>
          <button className="flex items-center gap-2 border border-gray-300 text-darkgray px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );

  const ExportTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-darkgray">Export & Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-darkgray mb-4">1099 Export</h3>
          <p className="text-mediumgray mb-4">
            Export contractor payment data for 1099 tax forms. Includes all payments made in the selected year.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-darkgray mb-2">Tax Year</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-boldblue focus:border-transparent">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <button className="w-full bg-aquagreen text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
            Export 1099 CSV
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-darkgray mb-4">Payment Reports</h3>
          <p className="text-mediumgray mb-4">
            Generate comprehensive payment reports for accounting and record-keeping purposes.
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="milestones" className="mr-2" defaultChecked />
              <label htmlFor="milestones" className="text-sm text-darkgray">Include milestones</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="invoices" className="mr-2" defaultChecked />
              <label htmlFor="invoices" className="text-sm text-darkgray">Include invoices</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="payments" className="mr-2" defaultChecked />
              <label htmlFor="payments" className="text-sm text-darkgray">Include payments</label>
            </div>
          </div>
          <button className="w-full bg-boldblue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  const TipsSection = () => (
    <div className="bg-skyblue border border-lightblue rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-darkgray mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Pro Tips
      </h3>
      <ul className="space-y-2 text-sm text-darkgray">
        <li>• Set up milestone payments to ensure steady cash flow throughout your project</li>
        <li>• Use payment templates to maintain consistency across all client contracts</li>
        <li>• Export 1099 data early in the year to streamline tax preparation</li>
        <li>• Include clear late fee policies in your payment terms to encourage timely payment</li>
      </ul>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'milestones':
        return <MilestonesTab />;
      case 'invoices':
        return <InvoicesTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'export':
        return <ExportTab />;
      default:
        return <MilestonesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-lightgray">
      {/* Demo Toggle */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-darkgray">Contract Wizard</h1>
          <button
            onClick={() => setIsPremium(!isPremium)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isPremium
                ? 'bg-aquagreen text-white'
                : 'bg-gray-200 text-darkgray'
              }`}
          >
            {isPremium ? 'Premium User' : 'Free User'} (Demo Toggle)
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                          ? 'bg-boldblue text-white'
                          : 'text-darkgray hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative">
            {!isPremium && <LockedOverlay descriptionText='Unlock the Contract Wizard to create milestones, generate invoices, and manage payment templates.' />}

            <div className={!isPremium ? 'filter blur-sm pointer-events-none' : ''}>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {renderActiveTab()}
                <TipsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractWizardInterface;