const { rpcs } = require('./jsonrpc');

function init(web3, provider) {
  const originWeb3 = web3 || {};

  const providerProxy = new Proxy(provider, {
    get(target, prop, receiver) {
      if (['send', 'request'].includes(prop)) {
        return (method, ...args) => {
          if (typeof method === 'object') {
            return tronWrap.send(method.method.replace(/^evm_/, 'tre_'), ...(method.params || []));
          }
          return tronWrap.send(method.replace(/^evm_/, 'tre_'), ...args);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });

  const accountsProxy = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if (prop === 'create') return Reflect.get(tronWeb, 'createAccount', receiver);
        if (prop === 'privateKeyToAccount') return Reflect.get(tronWeb.address, 'fromPrivateKey', receiver);
        throw new Error(`tronWeb.trx doesn't have prop ${prop}, please convert it manually`);
      }
    }
  );

  const ethProxy = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if (prop in tronWeb.trx) return Reflect.get(tronWeb.trx, prop, receiver);
        if (prop === 'accounts') return accountsProxy;
        if (prop in rpcs) return Reflect.get(rpcs, prop, receiver);
        throw new Error(`tronWeb.trx doesn't have prop ${prop}, please convert it manually`);
      }
    }
  );

  const utilsProxy = new Proxy(
    {},
    {
      get(target, prop, receiver) {
        if (prop in tronWeb.utils) return Reflect.get(tronWeb.utils, prop, receiver);
        if (prop in tronWeb) return Reflect.get(tronWeb, prop, receiver);
        return Reflect.get(originWeb3.utils, prop, receiver);
      }
    }
  );

  const web3Proxy = new Proxy(originWeb3, {
    get(target, prop, receiver) {
      if (prop === 'eth') return ethProxy;
      if (prop === 'utils') return utilsProxy;
      if (prop in tronWeb) return tronWeb[prop];
      return Reflect.get(target, prop, receiver);
    }
  });

  return [web3Proxy, providerProxy];
}

module.exports = function (web3 = {}, provider = {}) {
  return init(web3, provider);
};
