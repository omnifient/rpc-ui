export const sendRpcRequest = async (rpcUrl, method, params) => {
  const id = Date.now();
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params: params,
      id,
    }),
  });

  return response.json();
};

export const generateCurlCommand = (rpcUrl, method, params) => {
  const id = Date.now();
  return `curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"${method}","params":${params || '[]'},"id":${id}}' ${rpcUrl}`;
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

export const parseBalanceResponse = (response) => {
  if (!response || !response.result) return { raw: response, formatted: null };

  const result = response.result;
  let formatted = null;

  if (typeof result === 'string' && result.startsWith('0x')) {
    const weiValue = parseInt(result, 16).toString();
    const ethValue = (parseInt(weiValue) / 1e18).toFixed(6);
    formatted = {
      type: 'balance',
      wei: weiValue,
      eth: ethValue,
      unit: 'ETH'
    };
  }

  return {
    raw: response,
    formatted
  };
};

export const parseTransactionCountResponse = (response) => {
  if (!response || !response.result) return { raw: response, formatted: null };

  const result = response.result;
  let formatted = null;

  if (typeof result === 'string' && result.startsWith('0x')) {
    const count = parseInt(result, 16).toString();
    formatted = {
      type: 'transactionCount',
      count: count,
      humanReadable: `Nonce: ${count}`
    };
  }

  return {
    raw: response,
    formatted
  };
};

export const parseBlockResponse = (response) => {
  if (!response || !response.result) return { raw: response, formatted: null };

  const result = response.result;
  let formatted = null;

  if (result && typeof result === 'object') {
    formatted = {
      type: 'block',
      number: result.number ? parseInt(result.number, 16).toString() : 'N/A',
      hash: result.hash || 'N/A',
      timestamp: result.timestamp ? new Date(parseInt(result.timestamp, 16) * 1000).toISOString() : 'N/A',
      transactions: result.transactions ? result.transactions.length : 0,
      gasUsed: result.gasUsed ? parseInt(result.gasUsed, 16).toString() : 'N/A',
      gasLimit: result.gasLimit ? parseInt(result.gasLimit, 16).toString() : 'N/A'
    };
  }

  return {
    raw: response,
    formatted
  };
};

export const parseTransactionResponse = (response) => {
  if (!response || !response.result) return { raw: response, formatted: null };

  const result = response.result;
  let formatted = null;

  if (result && typeof result === 'object') {
    formatted = {
      type: 'transaction',
      hash: result.hash || 'N/A',
      from: result.from || 'N/A',
      to: result.to || 'N/A',
      value: result.value ? (parseInt(result.value, 16) / 1e18).toFixed(6) : 'N/A',
      gas: result.gas ? parseInt(result.gas, 16).toString() : 'N/A',
      gasPrice: result.gasPrice ? (parseInt(result.gasPrice, 16) / 1e9).toFixed(2) : 'N/A',
      nonce: result.nonce ? parseInt(result.nonce, 16).toString() : 'N/A',
      blockNumber: result.blockNumber ? parseInt(result.blockNumber, 16).toString() : 'N/A'
    };
  }

  return {
    raw: response,
    formatted
  };
};

// Enhanced parseHexResponse to use method-specific parsers
export const parseResponseByMethod = (response, method) => {
  switch (method) {
    case 'eth_gasPrice':
      return parseGasPriceResponse(response);
    case 'eth_getBalance':
      return parseBalanceResponse(response);
    case 'eth_getTransactionCount':
      return parseTransactionCountResponse(response);
    case 'eth_getBlockByNumber':
    case 'eth_getBlockByHash':
      return parseBlockResponse(response);
    case 'eth_getTransactionByHash':
    case 'eth_getTransactionByBlockHashAndIndex':
    case 'eth_getTransactionByBlockNumberAndIndex':
      return parseTransactionResponse(response);
    default:
      return parseHexResponse(response);
  }
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
