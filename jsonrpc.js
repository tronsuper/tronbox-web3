function request(id, method, params, X = 'post') {
  if (typeof tronWeb === 'undefined') throw new Error("it's not a tronbox env.");
  return tronWeb.fullNode
    .request(
      '/jsonrpc',
      {
        jsonrpc: '2.0',
        id,
        method,
        params
      },
      X
    )
    .then(resp => resp.result);
}

const methods = [
  {
    ethFnName: 'getAccounts',
    method: 'eth_accounts'
  },
  {
    ethFnName: 'getBlockNumber',
    method: 'eth_blockNumber'
  },
  {
    ethFnName: 'call',
    method: 'eth_call'
  },
  {
    ethFnName: 'getChainId',
    method: 'eth_chainId'
  },
  {
    ethFnName: 'getCoinbase',
    method: 'eth_coinbase'
  },
  {
    ethFnName: 'estimateGas',
    method: 'eth_estimateGas'
  },
  {
    ethFnName: 'getGasPrice',
    method: 'eth_gasPrice'
  },
  {
    ethFnName: 'getBalance',
    method: 'eth_getBalance'
  },
  {
    ethFnName: 'getBlock',
    method: 'eth_getBlockByHash'
  },
  {
    ethFnName: 'getBlock',
    method: 'eth_getBlockByNumber'
  },
  {
    ethFnName: 'getBlockTransactionCount',
    method: 'eth_getBlockTransactionCountByHash'
  },
  {
    ethFnName: 'getBlockTransactionCount',
    method: 'eth_getBlockTransactionCountByNumber'
  },
  {
    ethFnName: 'getCode',
    method: 'eth_getCode'
  },
  {
    ethFnName: 'getStorageAt',
    method: 'eth_getStorageAt'
  },
  {
    ethFnName: 'getTransactionFromBlock',
    method: 'eth_getTransactionByBlockHashAndIndex'
  },
  {
    ethFnName: 'getTransactionFromBlock',
    method: 'eth_getTransactionByBlockNumberAndIndex'
  },
  {
    ethFnName: 'getTransactionFromBlock',
    method: 'eth_getTransactionByHash'
  },
  {
    ethFnName: 'getTransactionReceipt',
    method: 'eth_getTransactionReceipt'
  },
  {
    ethFnName: 'getWork',
    method: 'eth_getWork'
  },
  {
    ethFnName: 'getProtocolVersion',
    method: 'eth_protocolVersion'
  },
  {
    ethFnName: 'isSyncing',
    method: 'eth_syncing'
  }
];

const rpcs = methods.reduce((rpcs, { ethFnName, method }) => {
  rpcs[ethFnName] = (...params) => request(1, method, params);
  return rpcs;
}, {});

module.exports.rpcs = rpcs;
