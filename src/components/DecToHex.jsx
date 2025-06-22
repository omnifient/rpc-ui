import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';

export function DecToHex() {
  const [decimal, setDecimal] = useState('');

  const hexValue = useMemo(() => {
    if (!decimal) return '';
    const num = BigInt(decimal);
    return '0x' + num.toString(16);
  }, [decimal]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '30px'
    }}>
      <h2 style={{ 
        margin: '0 0 25px 0',
        color: '#1e293b',
        fontSize: '1.8rem',
        fontWeight: '600'
      }}>
        Decimal to Hex Converter
      </h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600',
          color: '#374151',
          fontSize: '0.95rem'
        }}>
          Decimal Input:
        </label>
        <input
          type="text"
          value={decimal}
          onChange={(e) => setDecimal(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter a decimal number"
          style={{ 
            width: '100%', 
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.95rem',
            transition: 'border-color 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
      </div>

      <div>
        <h4 style={{ 
          margin: '0 0 8px 0',
          color: '#374151',
          fontSize: '0.95rem',
          fontWeight: '600'
        }}>
          Hexadecimal Output:
        </h4>
        <pre style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '1rem',
          border: '1px solid #e5e7eb',
          lineHeight: '1.4',
          color: '#1e293b',
          fontWeight: '500',
          minHeight: '2.5em',
          display: 'flex',
          alignItems: 'center'
        }}>
          {hexValue || <span style={{color: '#9ca3af', fontStyle: 'italic'}}>0x...</span>}
        </pre>
      </div>
    </div>
  );
} 