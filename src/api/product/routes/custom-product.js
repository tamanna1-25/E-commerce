'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/products/custom',
      handler: 'custom-product.createp',
    },
    
    
     {
  method: 'GET',
  path: '/products/public',
  handler: 'custom-product.publicList',
 
},
 {
  method: 'GET',
  path: '/products/public/name/:name',
  handler: 'custom-product.publicFindName',
  
},

{
  method: 'GET',
  path: '/products/public/:id',
  handler: 'custom-product.publicFindOne',
  
}, 
{
  method: 'GET',
  path: '/products/public/:name',
  handler: 'custom-product.publicFindName',
  
},
 
    {
      method: 'PUT',
      path: '/products/custom/:id',
      handler: 'custom-product.updatep',
      
    },
    {
      method: 'DELETE',
      path: '/products/custom/:id',
      handler: 'custom-product.deletep',
     
    },
    {
      method: 'GET',
      path: '/products/list',
      handler: 'custom-product.listProducts',
      
    },

   
    {
      method: 'GET',
      path: '/products/get/:id',
      handler: 'custom-product.getProductById',
     
    },
   

  ]
};
