import { h } from 'preact';
import { useState } from 'preact/hooks';
import { RpcHealth } from './components/RpcHealth';
import { RpcRequest } from './components/RpcRequest';

export function App() {
  const [rpcUrl, setRpcUrl] = useState('https://eth.llamarpc.com');
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const handleRpcUrlChange = (newUrl) => {
    setRpcUrl(newUrl);
  };

  const fetchHealthData = async () => {
    setHealthLoading(true);
    try {
      const { fetchRpcInfo } = await import('./utils/rpc');
      const result = await fetchRpcInfo(rpcUrl);
      setHealthData(result);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setHealthData({ status: 'error', error: error.message, lastChecked: Date.now() });
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          margin: '0 0 30px 0', 
          color: '#1e293b',
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          RPC UI
        </h1>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.95rem'
          }}>
            RPC URL:
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <input
              type="text"
              value={rpcUrl}
              onChange={(e) => handleRpcUrlChange(e.target.value)}
              placeholder="Enter RPC URL"
              style={{ 
                flex: 1,
                padding: '12px 16px', 
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              onClick={fetchHealthData}
              disabled={healthLoading}
              style={{
                padding: '12px 20px',
                backgroundColor: healthLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: healthLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => !healthLoading && (e.target.style.backgroundColor = '#2563eb')}
              onMouseLeave={(e) => !healthLoading && (e.target.style.backgroundColor = '#3b82f6')}
            >
              {healthLoading ? 'Fetching...' : 'Fetch Health Data'}
            </button>
          </div>
        </div>
      </div>

      <RpcHealth healthData={healthData} />

      <RpcRequest 
        rpcUrl={rpcUrl} 
        onRpcUrlChange={handleRpcUrlChange}
        title="RPC Request"
      />
    </div>
  );
} 