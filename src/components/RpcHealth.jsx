import { h } from 'preact';

export function RpcHealth({ healthData }) {
  if (!healthData) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          color: '#1e293b',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          RPC Health
        </h3>
        <div style={{ 
          color: '#6b7280', 
          fontStyle: 'italic',
          fontSize: '0.95rem',
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          Click "Fetch Health Data" above to check the RPC endpoint health.
        </div>
      </div>
    );
  }

  const isHealthy = healthData.status === 'healthy';
  const statusColor = isHealthy ? '#059669' : '#dc2626';
  const bgColor = isHealthy ? '#ecfdf5' : '#fef2f2';
  const borderColor = isHealthy ? '#10b981' : '#f87171';

  return (
    <div style={{ 
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '30px',
      border: `2px solid ${borderColor}`,
      backgroundColor: bgColor
    }}>
      
      <h3 style={{ 
        margin: '0 0 20px 0',
        color: '#1e293b',
        fontSize: '1.5rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>Status:</span>
        <span style={{ 
          color: statusColor,
          fontWeight: '700',
          textTransform: 'capitalize'
        }}>
          {healthData.status}
        </span>
      </h3>
      
      {isHealthy ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}
        >
          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Chain ID:</strong>
            <div style={{ color: '#1e293b', fontSize: '1.1rem', fontWeight: '600', marginTop: '4px' }}>
              {healthData.chainId.formatted?.decimal || 'N/A'}
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Block Number:</strong>
            <div style={{ color: '#1e293b', fontSize: '1.1rem', fontWeight: '600', marginTop: '4px' }}>
              {healthData.blockNumber.formatted?.decimal || 'N/A'}
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Gas Price:</strong>
            <div style={{ color: '#1e293b', fontSize: '1.1rem', fontWeight: '600', marginTop: '4px' }}>
              {healthData.gasPrice.formatted?.decimal || 'N/A'} {healthData.gasPrice.formatted?.unit || 'wei'}
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Archive Node:</strong>
            <div style={{ color: '#1e293b', fontSize: '1.1rem', fontWeight: '600', marginTop: '4px' }}>
              {healthData.isArchiveNode ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #fecaca',
          marginBottom: '20px'
        }}>
          <strong style={{ color: '#dc2626' }}>Error:</strong>
          <div style={{ color: '#991b1b', marginTop: '4px' }}>
            {healthData.error}
          </div>
        </div>
      )}
      
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '0.9rem',
        color: '#6b7280'
      }}>
        <strong>Last Checked:</strong> {new Date(healthData.lastChecked).toLocaleTimeString()}
      </div>
    </div>
  );
} 