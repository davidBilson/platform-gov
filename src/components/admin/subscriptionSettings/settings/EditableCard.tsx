import { EditSection } from "@/types/subscriptionSettings";
import { AlertCircle, Edit3, RefreshCw, Save, X } from "lucide-react";
import React from "react";


const EditableCard: React.FC<{
    section: EditSection;
    title: string;
    isEditing: boolean;
    isSaving: boolean;
    hasError: string | undefined;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    children: React.ReactNode;
    className?: string;
  }> = React.memo(({ 
    section, 
    title, 
    isEditing, 
    isSaving, 
    hasError, 
    onEdit, 
    onSave, 
    onCancel, 
    children, 
    className = '' 
  }) => {
    return (
      <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${isEditing ? 'border-boldblue shadow-lg' : hasError ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
        } ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-red-600 rounded-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-boldblue text-white rounded-md hover:bg-boldblue/70 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {section === 'gccDiscount' ? 'Generate Token' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={onEdit}
                  className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-boldblue hover:bg-boldblue/50 rounded-md transition-colors text-sm"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              )}
            </div>
          </div>
  
          {/* Content */}
          <div className="space-y-4">
            {children}
          </div>
  
          {/* Error message */}
          {hasError && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{hasError}</p>
            </div>
          )}
        </div>
      </div>
    );
  });

export default EditableCard;