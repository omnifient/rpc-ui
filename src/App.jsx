import { h } from 'preact';
import { useState } from 'preact/hooks';
import { sendRpcRequest, generateCurlCommand, parseHexResponse } from './utils/rpc';
import { RpcHealth } from './components/RpcHealth';

export function App() {
  const [rpcUrl, setRpcUrl] = useState('https://eth.llamarpc.com');
  const [method, setMethod] = useState('eth_blockNumber');
  const [params, setParams] = useState('[]');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSendRequest = async () => {
    try {
      setError(null);

      const data = await sendRpcRequest(rpcUrl, method, JSON.parse(params));
      setResponse(parseHexResponse(data));
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>RPC UI</h1>

      <RpcHealth rpcUrl={rpcUrl} />

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          placeholder="Enter RPC URL"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder="Enter Method"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="text"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          placeholder="Enter Params (JSON array)"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleSendRequest}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
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
              overflow: 'auto'
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
                overflow: 'auto'
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
          overflow: 'auto'
        }}>
          {generateCurlCommand(rpcUrl, method, params)}
        </pre>
      </div>
    </div>
  );
} 