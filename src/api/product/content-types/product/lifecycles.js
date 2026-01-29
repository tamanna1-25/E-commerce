'use strict';

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    
    if (data.stock !== undefined && Number(data.stock) <= 0) {
      throw new Error('Stock must be graeter than zero');
    }
  },
  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;
    const productId = where.id;

    console.log('🔧 [Product beforeUpdate] Product ID:', productId, 'Data:', data);

    // 1️⃣ Stock validation
    if (data.stock !== undefined) {
      const carts = await strapi.entityService.findMany('api::cart.cart', {
        filters: { product: productId },
        populate: ['user'],
      });

      carts.forEach(cart => {
        if (cart.quantity > data.stock) {
          console.error(`❌ User ${cart.user.id} has ${cart.quantity} in cart, stock reduced to ${data.stock}`);
          throw new Error(`Cannot reduce stock below ${cart.quantity} because users have it in cart`);
        }
      });
    }

    // 2️⃣ Prevent deactivation if product is in carts
    if (data.Active === false) {
      const carts = await strapi.entityService.findMany('api::cart.cart', {
        filters: { product: productId },
      });

      if (carts.length > 0) {
        console.error(`❌ Cannot deactivate product ${productId}, exists in ${carts.length} carts`);
        throw new Error('Cannot deactivate product; some users have it in their cart.');
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    console.log(`✅ [Product afterUpdate] Product ${result.id} updated`);
    
    if (params.data.stock !== undefined) {
      console.log(`📦 Stock changed for product ${result.name}: new stock = ${result.stock}`);
      const carts = await strapi.entityService.findMany('api::cart.cart', {
        filters: { product: result.id },
        populate: ['user'],
      });
      carts.forEach(cart => {
        console.log(`📢 User ${cart.user.id} has ${cart.quantity} in cart. New stock: ${result.stock}`);
      });
    }

    if (params.data.Active !== undefined) {
      console.log(`🔒 Product ${result.name} Active status changed to: ${result.Active}`);
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const productId = where.id;
    console.log('🗑️ [Product beforeDelete] Product ID:', productId);

    const carts = await strapi.entityService.findMany('api::cart.cart', {
      filters: { product: productId },
    });

    if (carts.length > 0) {
      console.error(`❌ Cannot delete product ${productId}, exists in ${carts.length} carts`);
      throw new Error('Cannot delete product; some users have it in their cart.');
    }
  }
};
