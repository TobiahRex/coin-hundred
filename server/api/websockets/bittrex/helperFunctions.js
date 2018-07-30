/* eslint-disable camelcase, import/prefer-default-export*/

import lodash from 'lodash';

export const map_keys = (__key) => {
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
