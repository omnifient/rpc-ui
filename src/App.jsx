import { h } from 'preact';
import { useState } from 'preact/hooks';
import { RpcHealth } from './components/RpcHealth';
import { RpcRequest } from './components/RpcRequest';

export function App() {
  const [rpcUrl, setRpcUrl] = useState('https://eth.llamarpc.com');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>RPC UI</h1>

      <RpcHealth rpcUrl={rpcUrl} />

      <RpcRequest 
        rpcUrl={rpcUrl} 
        onRpcUrlChange={setRpcUrl}
        title="RPC Request"
      />
    </div>
  );
} 