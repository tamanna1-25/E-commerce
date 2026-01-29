'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cart/custom/add',
      handler: 'custom-cart.add',
    },
    {
      method: 'GET',
      path: '/cart/custom',
      handler: 'custom-cart.view',
    },
    {
      method: 'DELETE',
      path: '/cart/custom/:id',
      handler: 'custom-cart.remove',
    },
    
  ],
};
