'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders/custom/place',
      handler: 'custom-order.place',
    },
    {
      method: 'GET',
      path: '/orders/custom',
      handler: 'custom-order.list',
    },
     {
      method: 'POST',
      path: '/orders/place-selected',
      handler: 'custom-order.placeSelected',
    },
  ],
};
