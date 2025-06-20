export const sendRpcRequest = async (rpcUrl, method, params) => {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params: params,
    }),
  });

  return response.json();
};

export const generateCurlCommand = (rpcUrl, method, params) => {
  return `curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"${method}","params":${params || '[]'}}' ${rpcUrl}`;
};

export const parseHexResponse = (response) => {
  if (!response || !response.result) return { raw: response, formatted: null };

  const result = response.result;
  let formatted = null;

  // Handle different types of hex responses
  if (typeof result === 'string' && result.startsWith('0x')) {
    // If it's a hex number (like block number)
    if (result.length <= 18) { // 0x + 16 hex digits
      formatted = {
        type: 'blockNumber',
        decimal: parseInt(result, 16).toString(),
      };
    }
    // If it's a hex string (like transaction hash)
    else if (result.length === 66) { // 0x + 64 hex digits
      formatted = {
        type: 'transactionHash',
        humanReadable: `Transaction Hash: ${result}`
      };
    }
    // If it's a hex string (like contract data)
    else {
      formatted = {
        type: 'data',
        humanReadable: `Data: ${result}`
      };
    }
  }
  // If result is an array of hex values
  else if (Array.isArray(result)) {
    formatted = {
      type: 'array',
      values: result.map(item =>
        typeof item === 'string' && item.startsWith('0x')
          ? {
            hex: item,
            decimal: parseInt(item, 16).toString(),
          }
          : item
      )
    };
  }

  return {
    raw: response,
    formatted
  };
};

export const parseGasPriceResponse = (response) => {
  if (!response || !response.result) return { raw: response, formatted: null };

  const result = response.result;
  let formatted = null;

  if (typeof result === 'string' && result.startsWith('0x')) {
    const weiValue = parseInt(result, 16).toString();
    formatted = {
      type: 'gasPrice',
      decimal: (parseInt(weiValue) / 1e9).toFixed(2),
      unit: 'Gwei'
    };
  }

  return {
    raw: response,
    formatted
  };
};

export const fetchRpcInfo = async (rpcUrl) => {
  try {
    const [blockNumber, chainId, gasPrice, oldestBlock] = await Promise.all([
      sendRpcRequest(rpcUrl, 'eth_blockNumber', []),
      sendRpcRequest(rpcUrl, 'eth_chainId', []),
      sendRpcRequest(rpcUrl, 'eth_gasPrice', []),
      sendRpcRequest(rpcUrl, 'eth_getBlockByNumber', ['0x0', false])
    ]);

    return {
      status: 'healthy',
      blockNumber: parseHexResponse(blockNumber),
      chainId: parseHexResponse(chainId),
      gasPrice: parseGasPriceResponse(gasPrice),
      isArchiveNode: oldestBlock.result !== null,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      lastChecked: new Date().toISOString()
    };
  }
}; 
