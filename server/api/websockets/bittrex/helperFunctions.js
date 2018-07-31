/* eslint-disable camelcase, import/prefer-default-export, consistent-return, new-cap, arrow-body-style */

import lodash from 'lodash';
import crypto from 'crypto';
import zlib from 'zlib'; // eslint-disable-line
const log = require('ololog').configure({ locate: false });

const apiSecret = process.env.BITTREX_API_SECRET;
const apiKey = process.env.BITTREX_API_KEY;
// const market = process.env.MARKET;

const mapKeys = (__key) => {
  const min_keys = [
    {
      key: 'A',
      val: 'Ask',
    },
    {
      key: 'a',
      val: 'Available',
    },
    {
      key: 'B',
      val: 'Bid',
    },
    {
      key: 'b',
      val: 'Balance',
    },
    {
      key: 'C',
      val: 'Closed',
    },
    {
      key: 'c',
      val: 'Currency',
    },
    {
      key: 'D',
      val: 'Deltas',
    },
    {
      key: 'd',
      val: 'Delta',
    },
    {
      key: 'E',
      val: 'Exchange',
    },
    {
      key: 'e',
      val: 'ExchangeDeltaType',
    },
    {
      key: 'F',
      val: 'FillType',
    },
    {
      key: 'f',
      val: 'Fills',
    },
    {
      key: 'G',
      val: 'OpenBuyOrders',
    },
    {
      key: 'g',
      val: 'OpenSellOrders',
    },
    {
      key: 'H',
      val: 'High',
    },
    {
      key: 'h',
      val: 'AutoSell',
    },
    {
      key: 'I',
      val: 'Id',
    },
    {
      key: 'i',
      val: 'IsOpen',
    },
    {
      key: 'J',
      val: 'Condition',
    },
    {
      key: 'j',
      val: 'ConditionTarget',
    },
    {
      key: 'K',
      val: 'ImmediateOrCancel',
    },
    {
      key: 'k',
      val: 'IsConditional',
    },
    {
      key: 'L',
      val: 'Low',
    },
    {
      key: 'l',
      val: 'Last',
    },
    {
      key: 'M',
      val: 'MarketName',
    },
    {
      key: 'm',
      val: 'BaseVolume',
    },
    {
      key: 'N',
      val: 'Nonce',
    },
    {
      key: 'n',
      val: 'CommissionPaid',
    },
    {
      key: 'O',
      val: 'Orders',
    },
    {
      key: 'o',
      val: 'Order',
    },
    {
      key: 'P',
      val: 'Price',
    },
    {
      key: 'p',
      val: 'CryptoAddress',
    },
    {
      key: 'Q',
      val: 'Quantity',
    },
    {
      key: 'q',
      val: 'QuantityRemaining',
    },
    {
      key: 'R',
      val: 'Rate',
    },
    {
      key: 'r',
      val: 'Requested',
    },
    {
      key: 'S',
      val: 'Sells',
    },
    {
      key: 's',
      val: 'Summaries',
    },
    {
      key: 'T',
      val: 'TimeStamp',
    },
    {
      key: 't',
      val: 'Total',
    },
    {
      key: 'U',
      val: 'Uuid',
    },
    {
      key: 'u',
      val: 'Updated',
    },
    {
      key: 'V',
      val: 'Volume',
    },
    {
      key: 'W',
      val: 'AccountId',
    },
    {
      key: 'w',
      val: 'AccountUuid',
    },
    {
      key: 'X',
      val: 'Limit',
    },
    {
      key: 'x',
      val: 'Created',
    },
    {
      key: 'Y',
      val: 'Opened',
    },
    {
      key: 'y',
      val: 'State',
    },
    {
      key: 'Z',
      val: 'Buys',
    },
    {
      key: 'z',
      val: 'Pending',
    },
    {
      key: 'CI',
      val: 'CancelInitiated',
    },
    {
      key: 'FI',
      val: 'FillId',
    },
    {
      key: 'DT',
      val: 'OrderDeltaType',
    },
    {
      key: 'OT',
      val: 'OrderType',
    },
    {
      key: 'OU',
      val: 'OrderUuid',
    },
    {
      key: 'PD',
      val: 'PrevDay',
    },
    {
      key: 'TY',
      val: 'Type',
    },
    {
      key: 'PU',
      val: 'PricePerUnit',
    },
  ];

  return lodash.filter(min_keys, __obj =>
    __obj.key === __key
  )[0].val;
};

const signature = (secretKey, challenge) => crypto
    .createHmac('sha512', secretKey)
    .update(challenge)
    .digest('hex');

const parseResponse = (__update, cb) => {
  const raw = new Buffer.from(__update, 'base64');
  zlib.inflateRaw(raw, (err, inflated) => {
    if (err) log.red('Parse Error at ZLIB: ', err);
    else {
      try {
        cb(JSON.parse(inflated.toString('utf8')));
      } catch (e) {
        log.red('Could not parse update: ', e);
      }
    }
  });
};

const summaryCurrentMarket = __marketSummary =>
  lodash.mapKeys(__marketSummary, (__val, __key) => {
    const key_long = mapKeys(__key);
    return key_long;
  });

const symbol = (__market) => {
  const split = __market.split('-');
  const base = split[0];
  const comp = split[1];
  return `${comp}/${base}`;
};

const side = (__order_type) => {
  if (__order_type === 'LIMIT_BUY') {
    return 'buy';
  } else if (__order_type === 'LIMIT_SELL') {
    return 'sell';
  }
};

/** Response Formatting Helper Functions */
const updatedOrder = (__order) => {
  const map = lodash.map([__order], (__obj) => {
    const order = __obj.o;
    const info = lodash.mapKeys(order, (__val, __key) => {
      const key_long = mapKeys(__key);
      return key_long;
    });

    return {
      status: status(__obj.TY),
      amount: __obj.o.Q,
      remaining: __obj.o.q,
      price: __obj.o.X,
      average: __obj.o.PU,
      uuid: __obj.o.U,
      id: __obj.o.OU,
      market_name: __obj.o.E,
      symbol: symbol(__obj.o.E),
      side: side(__obj.o.OT),
      info,
    };
  });
  return map[0];
};

const updatedBalance = __balance =>
  lodash.mapKeys(__balance, (__val, __key) => {
    const key_long = mapKeys(__key);
    return key_long;
  });

const cb_marketDelta = (__update) => {
  parseResponse(__update, (data) => {
    // remap Acronym keys to Full-name keys.
    Object.keys(data).forEach((__key) => {
      data[mapKeys(__key)] = data[__key];
      delete data[__key];
    });

    // remap 'Buys' array objects, who have acronym keys to full-name keys.
    ['Buys', 'Sells', 'Fills'].forEach((type) => {
      if (data[type].length) {
        data[type] = data[type].map((__typeObj) => {
          return Object.keys(__typeObj).reduce((acc, n) => {
            acc[mapKeys(n)] = __typeObj[n];
            delete __typeObj[n];
            return acc;
          }, {});
        });
      }
    });
    console.log(JSON.stringify(data, null, 2));
  });
};

const onPrivate = (__update) => {
  const raw = new Buffer.from(__update, 'base64');
  zlib.inflateRaw(raw, (err, inflated) => {
    if (!err) {
      const obj = JSON.parse(inflated.toString('utf8'));
      if (obj.o) {
        /** Order Updates */
        const order = updatedOrder(obj);
        if (order.side === 'buy') {
          log.blue('buy_order_update', JSON.stringify(order, null, 2));
        } else if (order.side === 'sell') {
          log.lightRed('sell_order_update', JSON.stringify(order, null, 2));
        }
      } else {
        /** Balance Updates */
        const balance = updatedBalance(obj.d);
        log.green('updated_balance', JSON.stringify(balance, null, 2));
      }
    }
  });
};

const cb_orderDelta = (__update) => {
  console.log('__update: ', __update);
  parseResponse(__update, (data) => {
    JSON.stringify(data, null, 2);
  });
};

const cb_balanceDelta = (__update) => {
  console.log('__update: ', __update);
  parseResponse(__update, (data) => {
    JSON.stringify(data, null, 2);
  });
};

const subscribeToMarket = (_client, _market) => {
  _client.call('c2', 'SubscribeToExchangeDeltas', _market)
  .done((err_2, result) => {
    if (err_2) log.red('Market Subscription Error: ', err_2);
    if (result === true) {
      log.white('Subscribed to ', _market);
      _client.on('c2', 'uE', cb_marketDelta);
    }
  });
};

const subscribeToAccount = (_client) => {
  _client.call('c2', 'GetAuthContext', apiKey)
  .done((auth_context_err, challenge) => {
    if (auth_context_err) log.red('auth_ERROR: ', auth_context_err);
    else log.yellow('Received Challenge: ', challenge);

    _client.call('c2', 'Authenticate', apiKey, signature(apiSecret, challenge))
    .done((auth_err, auth_result) => {
      if (auth_err) log.red('Authenticate Error: ', auth_err);
      else log.green('Subscribed to Account: ', auth_result);

      _client.on('c2', 'uB', cb_balanceDelta);
      _client.on('c2', 'u0', cb_orderDelta);
    });
  });
};

export default ({
  mapKeys,
  summaryCurrentMarket,
  updatedOrder,
  symbol,
  side,
  updatedBalance,
  cb_marketDelta,
  onPrivate,
  subscribeToAccount,
  subscribeToMarket,
});
