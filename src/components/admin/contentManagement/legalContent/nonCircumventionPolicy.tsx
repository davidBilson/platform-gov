import React, { useState, useEffect } from 'react';
import { getLegalContentByDocumentType, upsertLegalContent } from '@/api/legal-content-api';

const NonCircumventionPolicy = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    setLoading(true);
    try {
      const response = await getLegalContentByDocumentType('non-circumvention-policy');
      if (response?.success && response?.data) {
        setFormData({
          title: response.data.title || '',
          description: response.data.description || ''
        });
      }
    } catch (error) {
      // Silent fail - start with empty form
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    
    if (!formData.title?.trim() || !formData.description?.trim()) {
      return;
    }

    setSaving(true);
    try {
      await upsertLegalContent({
        documentType: 'non-circumvention-policy',
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      if (showPreview) {
        setShowPreview(false);
      }
    } catch (error) {
      // Error handling is done in the API
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boldblue"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-boldblue">
              Non-Circumvention Policy
            </h3>
            <button
              onClick={loadDocument}
              disabled={saving}
              className="text-sm text-gray-600 hover:text-boldblue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Refresh document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Write title here..."
                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue focus:border-boldblue transition-colors duration-200 placeholder-gray-400"
                required
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                // @ts-ignore
                onChange={handleInputChange}
                placeholder="Enter detailed description..."
                rows={8}
                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue focus:border-boldblue transition-colors duration-200 placeholder-gray-400 resize-vertical"
                required
                disabled={saving}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || (!formData.title?.trim() || !formData.description?.trim())}
                className="cursor-pointer bg-boldblue text-white font-semibold px-6 py-3 rounded-lg hover:bg-boldblue disabled:opacity-50 disabled:cursor-not-allowed outline-none transition-colors duration-200 flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Document'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={saving}
                className="cursor-pointer bg-blue-100 text-boldblue font-semibold px-6 py-3 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none transition-colors duration-200"
              >
                Preview
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-boldblue">
                Content Preview
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto scrollbar-hide max-h-[65vh]">
              <div className="max-w-3xl mx-auto">
                <div className="rounded-lg p-8 border border-gray-200">
                  {formData.title ? (
                    <h1 className="text-3xl font-bold text-boldblue mb-6">
                      {formData.title}
                    </h1>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      <p className="text-lg">No title provided</p>
                      <p className="text-sm mt-2">Add a title to see how it will appear</p>
                    </div>
                  )}

                  {formData.description ? (
                    <div className="prose max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {formData.description}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      <p className="text-lg">No description provided</p>
                      <p className="text-sm mt-2">Add a description to see how it will appear</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NonCircumventionPolicy;