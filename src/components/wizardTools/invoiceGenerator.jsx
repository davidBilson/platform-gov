import React, { useState } from 'react';

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    fromCompany: '',
    fromAddress: '',
    fromCity: '',
    fromState: '',
    fromZip: '',
    fromEmail: '',
    fromPhone: '',
    toCompany: '',
    toAddress: '',
    toCity: '',
    toState: '',
    toZip: '',
    toEmail: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    tax: 0,
    discount: 0
  });

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateField = (field, value) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * invoiceData.tax) / 100;
    return afterDiscount + taxAmount;
  };

  const generatePDF = async () => {
    try {
      // Load jsPDF dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      let yPosition = 20;
      const leftMargin = 20;
      const rightMargin = 190;
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(11,95,148); // boldblue color
      doc.text('GOVLINK GLOBAL', leftMargin, yPosition);
      
      // Invoice details (right side)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      if (invoiceData.invoiceNumber) {
        doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, rightMargin, 20, { align: 'right' });
      }
      if (invoiceData.date) {
        doc.text(`Date: ${invoiceData.date}`, rightMargin, 27, { align: 'right' });
      }
      if (invoiceData.dueDate) {
        doc.text(`Due Date: ${invoiceData.dueDate}`, rightMargin, 34, { align: 'right' });
      }
      
      yPosition = 50;
      
      // From company
      if (invoiceData.fromCompany) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('FROM:', leftMargin, yPosition);
        yPosition += 7;
        doc.setFont(undefined, 'normal');
        doc.text(invoiceData.fromCompany, leftMargin, yPosition);
        yPosition += 10;
      }
      
      // To company
      if (invoiceData.toCompany) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('BILL TO:', leftMargin, yPosition);
        yPosition += 7;
        doc.setFont(undefined, 'normal');
        doc.text(invoiceData.toCompany, leftMargin, yPosition);
        yPosition += 15;
      }
      
      // Items table header
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Description', leftMargin, yPosition);
      doc.text('Qty', 120, yPosition);
      doc.text('Rate', 140, yPosition);
      doc.text('Amount', rightMargin, yPosition, { align: 'right' });
      
      // Draw line under header
      yPosition += 2;
      doc.line(leftMargin, yPosition, rightMargin, yPosition);
      yPosition += 8;
      
      // Items
      doc.setFont(undefined, 'normal');
      invoiceData.items.forEach((item) => {
        if (item.description || item.quantity > 0 || item.rate > 0) {
          doc.text(item.description || 'Item', leftMargin, yPosition);
          doc.text(item.quantity.toString(), 120, yPosition);
          doc.text(`$${item.rate.toFixed(2)}`, 140, yPosition);
          doc.text(`$${item.amount.toFixed(2)}`, rightMargin, yPosition, { align: 'right' });
          yPosition += 7;
        }
      });
      
      yPosition += 10;
      
      // Calculations
      const subtotal = calculateSubtotal();
      const discountAmount = (subtotal * invoiceData.discount) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (afterDiscount * invoiceData.tax) / 100;
      const total = calculateTotal();
      
      doc.text('Subtotal:', 150, yPosition);
      doc.text(`$${subtotal.toFixed(2)}`, rightMargin, yPosition, { align: 'right' });
      yPosition += 7;
      
      if (invoiceData.discount > 0) {
        doc.text(`Discount (${invoiceData.discount}%):`, 150, yPosition);
        doc.text(`-$${discountAmount.toFixed(2)}`, rightMargin, yPosition, { align: 'right' });
        yPosition += 7;
      }
      
      if (invoiceData.tax > 0) {
        doc.text(`Tax (${invoiceData.tax}%):`, 150, yPosition);
        doc.text(`$${taxAmount.toFixed(2)}`, rightMargin, yPosition, { align: 'right' });
        yPosition += 7;
      }
      
      // Total
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      yPosition += 3;
      doc.text('TOTAL:', 150, yPosition);
      doc.text(`$${total.toFixed(2)}`, rightMargin, yPosition, { align: 'right' });
      
      // Notes
      if (invoiceData.notes) {
        yPosition += 20;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Notes:', leftMargin, yPosition);
        yPosition += 7;
        doc.setFont(undefined, 'normal');
        const splitNotes = doc.splitTextToSize(invoiceData.notes, 170);
        doc.text(splitNotes, leftMargin, yPosition);
      }
      
      // Download the PDF
      const fileName = invoiceData.invoiceNumber 
        ? `Invoice-${invoiceData.invoiceNumber}.pdf` 
        : 'Invoice.pdf';
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen  py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-boldblue text-white p-6">
            <h1 className="text-3xl font-bold">Invoice Generator</h1>
            <p className="mt-2 opacity-90">Create professional invoices with PDF download</p>
          </div>

          <div className="grid lg:grid-cols-1 gap-6 p-6">
            {/* Form Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Invoice Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => updateField('invoiceNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                      placeholder="INV-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => updateField('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">From</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={invoiceData.fromCompany}
                      onChange={(e) => updateField('fromCompany', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Bill To (Client)</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={invoiceData.toCompany}
                      onChange={(e) => updateField('toCompany', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                      placeholder="Client Company Name"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Items</h2>
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-boldblue text-white rounded-md hover:bg-boldblue/70 transition-colors text-sm font-medium cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end">
                          <button
                            onClick={() => removeItem(index)}
                            className="w-full px-3 py-2 bg-crimson text-white rounded-md hover:bg-crimson/70 transition-colors text-sm"
                            disabled={invoiceData.items.length === 1}
                          >
                            ×
                          </button>
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <div className="px-3 py-2 bg-gray-100 rounded-md text-right font-medium">
                            ${item.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
                    <input
                      type="number"
                      value={invoiceData.tax}
                      onChange={(e) => updateField('tax', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={invoiceData.discount}
                      onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-transparent"
                    placeholder="Additional notes or payment terms..."
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={generatePDF}
                  className="cursor-pointer px-8 py-3 bg-aquagreen text-white rounded-lg hover:bg-aquagreen/70 transition-colors text-lg font-semibold shadow-lg"
                >
                  Download PDF Invoice
                </button>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;