import { h } from 'preact';
import { useState } from 'preact/hooks';
import { sendRpcRequest, generateCurlCommand, parseResponseByMethod } from '../utils/rpc';

export function RpcRequest({ rpcUrl, onRpcUrlChange, title = "RPC Request" }) {
  const [method, setMethod] = useState('eth_blockNumber');
  const [params, setParams] = useState('[]');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const data = await sendRpcRequest(rpcUrl, method, JSON.parse(params));
      setResponse(parseResponseByMethod(data, method));
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    // Reset params for certain methods
    if (newMethod === 'eth_blockNumber' || newMethod === 'eth_chainId' || newMethod === 'eth_gasPrice') {
      setParams('[]');
    } else if (newMethod === 'eth_getBalance') {
      setParams('["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "latest"]');
    } else if (newMethod === 'eth_getTransactionCount') {
      setParams('["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "latest"]');
    } else if (newMethod === 'eth_getBlockByNumber') {
      setParams('["latest", false]');
    } else if (newMethod === 'eth_getTransactionByHash') {
      setParams('["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]');
    }
  };

  const predefinedMethods = [
    { value: 'eth_blockNumber', label: 'Get Block Number' },
    { value: 'eth_chainId', label: 'Get Chain ID' },
    { value: 'eth_gasPrice', label: 'Get Gas Price' },
    { value: 'eth_getBalance', label: 'Get Balance' },
    { value: 'eth_getTransactionCount', label: 'Get Transaction Count' },
    { value: 'eth_getBlockByNumber', label: 'Get Block By Number' },
    { value: 'eth_getTransactionByHash', label: 'Get Transaction By Hash' },
    { value: 'eth_call', label: 'Call Contract' },
    { value: 'eth_estimateGas', label: 'Estimate Gas' },
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h2 style={{ 
        margin: '0 0 25px 0',
        color: '#1e293b',
        fontSize: '1.8rem',
        fontWeight: '600'
      }}>
        {title}
      </h2>

      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', marginBottom: '12px' }}>
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              Method:
            </label>
            <select
              value={predefinedMethods.some(({ value }) => value === method) ? method : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setMethod('');
                } else {
                  handleMethodChange(e.target.value);
                }
              }}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem',
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box',
                minWidth: 0
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              {predefinedMethods.map(({ value, label }) => (
                <option key={value} value={value}>{label} ({value})</option>
              ))}
              <option value="custom">Custom call</option>
            </select>
          </div>
          {(!predefinedMethods.some(({ value }) => value === method)) && (
            <div style={{ flex: '2 1 220px', minWidth: 0 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem',
                visibility: 'hidden' // visually aligns with select label
              }}>
                &nbsp;
              </label>
              <input
                type="text"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Enter custom method"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  transition: 'border-color 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  minWidth: 0
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600',
          color: '#374151',
          fontSize: '0.95rem'
        }}>
          Parameters (JSON array):
        </label>
        <textarea
          value={params}
          onChange={(e) => setParams(e.target.value)}
          placeholder="Enter Params (JSON array)"
          rows={3}
          style={{ 
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.95rem',
            transition: 'border-color 0.2s ease',
            outline: 'none',
            resize: 'vertical',
            overflowWrap: 'break-word'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
        <div style={{ 
          fontSize: '0.85rem', 
          color: '#6b7280', 
          marginTop: '6px',
          fontStyle: 'italic'
        }}>
          Examples: [] for no params, ["0x123..."] for address, ["0x123...", "latest"] for address + block
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <button
          onClick={handleSendRequest}
          disabled={isLoading}
          style={{
            padding: '14px 24px',
            backgroundColor: isLoading ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#059669')}
          onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#10b981')}
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: '#dc2626', 
          marginBottom: '25px', 
          padding: '16px', 
          backgroundColor: '#fef2f2', 
          borderRadius: '8px',
          border: '1px solid #fecaca',
          fontSize: '0.9rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div>
        <h3 style={{ 
          margin: '0 0 15px 0',
          color: '#1e293b',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          cURL Command:
        </h3>
        <pre style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.8rem',
          border: '1px solid #e5e7eb',
          lineHeight: '1.4'
        }}>
          {generateCurlCommand(rpcUrl, method, params)}
        </pre>
      </div>

      {response && (
        <>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              margin: '0 0 15px 0',
              color: '#1e293b',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              Raw Response:
            </h3>
            <pre style={{ 
              backgroundColor: '#f8fafc', 
              padding: '20px', 
              borderRadius: '8px',
              overflow: 'auto',
              maxHeight: '300px',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              {JSON.stringify(response.raw, null, 2)}
            </pre>
          </div>

          {response.formatted && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0',
                color: '#1e293b',
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                Formatted Response:
              </h3>
              <pre style={{ 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                overflow: 'auto',
                maxHeight: '300px',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}>
                {JSON.stringify(response.formatted, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
} 