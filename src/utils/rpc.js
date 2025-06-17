export const sendRpcRequest = async (rpcUrl, method, params) => {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params: params ? JSON.parse(params) : [],
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