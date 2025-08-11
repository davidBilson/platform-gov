import React, { useState } from 'react';
import jsPDF from 'jspdf';

// Main 1099-NEC Copy B Generator Component
export default function Form1099NECGenerator() {
  // State to hold all form data
  const [formData, setFormData] = useState({
    payerName: '',
    payerAddress: '',
    payerEIN: '',
    recipientName: '',
    recipientAddress: '',
    recipientSSN: '',
    taxYear: new Date().getFullYear().toString(),
    nonemployeeCompensation: ''
  });

  // Handle input field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format currency for display
  const formatCurrency = (value) => {
    if (!value) return '';
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(numValue) ? '' : numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Generate and download the PDF
  const generatePDF = () => {
    // Create new jsPDF document in portrait orientation
    const doc = new jsPDF('portrait', 'pt', 'letter');
    
    // Set document properties
    doc.setProperties({
      title: '1099-NEC Copy B',
      subject: 'Tax Document',
      creator: '1099-NEC Generator'
    });

    // Document dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors and styling
    const borderColor = [0, 0, 0]; // Black
    const lightGray = [240, 240, 240];
    
    // Helper function to draw a box with text
    const drawBox = (x, y, width, height, label, value, labelSize = 8, valueSize = 10) => {
      // Draw box border
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(1);
      doc.rect(x, y, width, height);
      
      // Add label (top-left of box)
      if (label) {
        doc.setFontSize(labelSize);
        doc.setFont('helvetica', 'normal');
        doc.text(label, x + 3, y + 12);
      }
      
      // Add value (center-left of box, below label)
      if (value) {
        doc.setFontSize(valueSize);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x + 3, y + height - 10);
      }
    };

    // Title and form header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Form 1099-NEC', 50, 40);
    
    doc.setFontSize(12);
    doc.text('Nonemployee Compensation', 50, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Copy B - For Recipient', 50, 80);
    doc.text(`Tax Year: ${formData.taxYear}`, 50, 100);

    // Payer Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYER\'S Information', 50, 130);
    
    // Payer boxes
    drawBox(50, 140, 250, 40, 'PAYER\'S name', formData.payerName);
    drawBox(310, 140, 200, 40, 'PAYER\'S TIN', formData.payerEIN);
    drawBox(50, 190, 460, 60, 'PAYER\'S address (including zip code)', formData.payerAddress);

    // Recipient Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIPIENT\'S Information', 50, 280);
    
    // Recipient boxes
    drawBox(50, 290, 250, 40, 'RECIPIENT\'S name', formData.recipientName);
    drawBox(310, 290, 200, 40, 'RECIPIENT\'S TIN', formData.recipientSSN);
    drawBox(50, 340, 460, 60, 'RECIPIENT\'S address (including zip code)', formData.recipientAddress);

    // Payment Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', 50, 430);
    
    // Box 1 - Nonemployee compensation (main payment box)
    drawBox(50, 440, 200, 60, '1. Nonemployee compensation', 
             formData.nonemployeeCompensation ? `${formatCurrency(formData.nonemployeeCompensation)}` : '', 
             8, 12);
    
    // Additional boxes for 1099-NEC layout (empty for this demo)
    drawBox(260, 440, 120, 30, '2. Payer made direct sales of', '');
    drawBox(390, 440, 120, 30, 'totaling $5,000 or more of', '');
    drawBox(260, 480, 250, 20, 'consumer products to recipient', '');
    
    // Federal income tax withheld
    drawBox(50, 510, 200, 40, '4. Federal income tax withheld', '');
    
    // State information
    drawBox(260, 510, 100, 40, '5. State tax withheld', '');
    drawBox(370, 510, 70, 40, '6. State no.', '');
    drawBox(450, 510, 60, 40, '7. State income', '');

    // Instructions section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Instructions for Recipient:', 50, 580);
    doc.text('Account number (see instructions)', 50, 600);
    
    // Add instructional text
    const instructions = [
      'You have received this Form 1099-NEC because you received $600 or more in nonemployee',
      'compensation during the tax year shown. Report this income on your tax return.',
      'If federal income tax was withheld (box 4), attach this form to your return.',
      'Keep this copy for your records.'
    ];
    
    let yPos = 620;
    instructions.forEach(instruction => {
      doc.text(instruction, 50, yPos);
      yPos += 15;
    });

    // Footer information
    doc.setFontSize(8);
    doc.text('Form 1099-NEC (Rev. 12-2020)', 50, 720);
    doc.text('Copy B - For Recipient', 400, 720);

    // Generate filename with current date and recipient name
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0');
    
    const recipientName = formData.recipientName.replace(/[^a-zA-Z0-9]/g, '_') || 'Recipient';
    const filename = `1099-NEC_${formData.taxYear}_${recipientName}_${dateStr}.pdf`;
    
    // Download the PDF
    doc.save(filename);
  };

  // Form validation
  const isFormValid = () => {
    return formData.payerName && 
           formData.payerEIN && 
           formData.recipientName && 
           formData.recipientSSN && 
           formData.nonemployeeCompensation;
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #333',
        paddingBottom: '20px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '5px' }}>1099-NEC Copy B Generator</h1>
        <p style={{ color: '#666', margin: '0' }}>Generate PDF for Independent Contractors</p>
      </div>

      {/* Main Form */}
      <form style={{ display: 'grid', gap: '20px' }}>
        
        {/* Payer Information Section */}
        <section style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>Payer Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Payer Name *
              </label>
              <input
                type="text"
                value={formData.payerName}
                onChange={(e) => handleInputChange('payerName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Company or individual name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Payer EIN *
              </label>
              <input
                type="text"
                value={formData.payerEIN}
                onChange={(e) => handleInputChange('payerEIN', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="XX-XXXXXXX"
              />
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Payer Address
            </label>
            <textarea
              value={formData.payerAddress}
              onChange={(e) => handleInputChange('payerAddress', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '60px',
                resize: 'vertical'
              }}
              placeholder="Street address, city, state, ZIP code"
            />
          </div>
        </section>

        {/* Recipient Information Section */}
        <section style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>Recipient Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Recipient Name *
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="Contractor's full name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Recipient SSN/EIN *
              </label>
              <input
                type="text"
                value={formData.recipientSSN}
                onChange={(e) => handleInputChange('recipientSSN', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="XXX-XX-XXXX or XX-XXXXXXX"
              />
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Recipient Address
            </label>
            <textarea
              value={formData.recipientAddress}
              onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '60px',
                resize: 'vertical'
              }}
              placeholder="Street address, city, state, ZIP code"
            />
          </div>
        </section>

        {/* Payment Information Section */}
        <section style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>Payment Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Tax Year
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={formData.taxYear}
                onChange={(e) => handleInputChange('taxYear', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nonemployee Compensation (Box 1) *
              </label>
              <input
                type="text"
                value={formData.nonemployeeCompensation}
                onChange={(e) => {
                  // Allow only numbers, decimals, and commas for currency input
                  const value = e.target.value.replace(/[^0-9.,]/g, '');
                  handleInputChange('nonemployeeCompensation', value);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="0.00"
              />
              {formData.nonemployeeCompensation && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Formatted: ${formatCurrency(formData.nonemployeeCompensation)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Generate PDF Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={generatePDF}
            disabled={!isFormValid()}
            style={{
              backgroundColor: isFormValid() ? '#007cba' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              if (isFormValid()) e.target.style.backgroundColor = '#005a87';
            }}
            onMouseOut={(e) => {
              if (isFormValid()) e.target.style.backgroundColor = '#007cba';
            }}
          >
            {isFormValid() ? 'Generate & Download PDF' : 'Complete Required Fields'}
          </button>
          
          {!isFormValid() && (
            <div style={{ 
              color: '#d32f2f', 
              fontSize: '14px', 
              marginTop: '10px' 
            }}>
              * Please fill in all required fields marked with asterisks
            </div>
          )}
        </div>
      </form>

      {/* Footer Information */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h3 style={{ marginTop: '0', color: '#333' }}>Important Notes:</h3>
        <ul style={{ marginBottom: '0' }}>
          <li>This generator creates a PDF for <strong>Copy B (For Recipient)</strong> purposes</li>
          <li>All data is processed locally in your browser - nothing is sent to servers</li>
          <li>Keep the generated PDF for tax filing and record-keeping purposes</li>
          <li>Consult with a tax professional for official tax document requirements</li>
        </ul>
      </div>
    </div>
  );
}