import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, label: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate 
}) => {
  const [systemName, setSystemName] = useState('');
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  // Function to convert string to camelCase
  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  };


  useEffect(() => {
    setName(toCamelCase(systemName));
  }, [systemName]);

  const handleSubmit = () => {
    if (!name.trim() || !label.trim()) {
      setError('Both fields are required');
      return;
    }
    
    onCreate(name.trim(), label.trim());
    setSystemName('');
    setLabel('');
    setError('');
  };

  const handleClose = () => {
    setSystemName('');
    setName('');
    setLabel('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-boldblue">Create New Category</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Name ({name || "unique identifier"})
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full border border-deepskyblue/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepskyblue"
              placeholder="e.g., departments"
            />
            <p></p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-deepskyblue/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepskyblue"
              placeholder="e.g., Departments"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-deepskyblue text-white rounded-lg hover:bg-deepskyblue/50 text-sm cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;