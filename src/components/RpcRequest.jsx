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
    <div style={{ marginBottom: '30px' }}>
      <h2>{title}</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          RPC URL:
        </label>
        <input
          type="text"
          value={rpcUrl}
          onChange={(e) => onRpcUrlChange(e.target.value)}
          placeholder="Enter RPC URL"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Method:
        </label>
        <select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          {predefinedMethods.map(({ value, label }) => (
            <option key={value} value={value}>{label} ({value})</option>
          ))}
        </select>
        <input
          type="text"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder="Or enter custom method"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Parameters (JSON array):
        </label>
        <input
          type="text"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          placeholder="Enter Params (JSON array)"
          style={{ width: '100%', padding: '8px' }}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Examples: [] for no params, ["0x123..."] for address, ["0x123...", "latest"] for address + block
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleSendRequest}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h3>Raw Response:</h3>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(response.raw, null, 2)}
            </pre>
          </div>

          {response.formatted && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Formatted Response:</h3>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {JSON.stringify(response.formatted, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}

      <div>
        <h3>cURL Command:</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {generateCurlCommand(rpcUrl, method, params)}
        </pre>
      </div>
    </div>
  );
} 