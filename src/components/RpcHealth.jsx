import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { fetchRpcInfo } from '../utils/rpc';

export function RpcHealth({ rpcUrl }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true);
      const result = await fetchRpcInfo(rpcUrl);
      setInfo(result);
      setLoading(false);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [rpcUrl]);

  if (loading) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3>RPC Health</h3>
        <div>Loading...</div>
      </div>
    );
  }

  if (!info) {
    return null;
  }

  return (
    <div style={{ 
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: info.status === 'healthy' ? '#e8f5e9' : '#ffebee',
      borderRadius: '4px',
      border: `1px solid ${info.status === 'healthy' ? '#4caf50' : '#f44336'}`
    }}>
      
      <h3 style={{ margin: '0 0 10px 0' }}>
        <span>Status:</span>
        &nbsp;
        <span>
          {info.status}
        </span>
      </h3>
      
      {info.status === 'healthy' ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '10px'
            }}
          >
            <div>
              <strong>Chain ID:</strong> {info.chainId.formatted?.decimal || 'N/A'}
            </div>
            <div>
              <strong>Block Number:</strong> {info.blockNumber.formatted?.decimal || 'N/A'}
            </div>
            <div>
              <strong>Gas Price:</strong> {info.gasPrice.formatted?.decimal || 'N/A'} {info.gasPrice.formatted?.unit || 'wei'}
            </div>
            <div>
              <strong>Archive Node:</strong> {info.isArchiveNode ? 'Yes' : 'No'}
            </div>
          </div>
        </>
      ) : (
        <div>
          <strong>Error:</strong> {info.error}
        </div>
      )}
      
      <div>
        <strong>Last Checked:</strong> {new Date(info.lastChecked).toLocaleTimeString()}
      </div>
    </div>
  );
} 