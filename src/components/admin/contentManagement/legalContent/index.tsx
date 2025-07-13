import React, { useState } from 'react';
import ConsentToSignaturesCommunications from './consentToSignaturesCommunicationst';
import LiabilityDisclaimer from './liabilityDisclaimer';
import NonCircumventionPolicy from './nonCircumventionPolicy';
import TermsOfUse from './termsOfUse';

const LegalContent = () => {
    const [activeTab, setActiveTab] = useState('terms-of-use');

    const tabs = [
        { 
            id: 'terms-of-use', 
            label: 'Terms of Use', 
            component: <TermsOfUse /> 
        },
        { 
            id: 'consent-signatures', 
            label: 'Consent To Signatures & Commission', 
            component: <ConsentToSignaturesCommunications /> 
        },
        { 
            id: 'liability-disclaimer', 
            label: 'Liability Disclaimer', 
            component: <LiabilityDisclaimer /> 
        },
        { 
            id: 'non-circumvention', 
            label: 'Non-Circumvention Policy', 
            component: <NonCircumventionPolicy /> 
        }
    ];

    return (
        <main>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-boldblue mb-2">Manage Legal Content</h2>
            </div>
            
            {/* Sub-tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-4 cursor-pointer text-xs font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
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
            <section className="min-h-[300px]">
                {tabs.find(tab => tab.id === activeTab)?.component}
            </section>
        </main>
    )
}

export default LegalContent;