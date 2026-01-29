'use strict';

module.exports = {
 
  async beforeCreate(event) {
    const { data } = event.params;
    console.log('🛒 [Cart Lifecycle] beforeCreate triggered:', data);

    if ( Number(data.quantity) <=0) {
      throw new Error('Stock must be graeter than zero');
    }
    // if (!data.product || data.quantity===undefined || !data.user ) {
    //   console.log('⚠️ Missing product, quantity, or user. Skipping stock check.');
    //   return;
    // }
    
   if (!data.product || !data.quantity| !data.user ) {
      console.log('⚠️ Missing product, quantity, or user. Skipping stock check.');
      return;
    }

    // Fetch product from DB
    const product = await strapi.entityService.findOne('api::product.product', data.product);
    if (!product) {
      console.error('❌ Product does not exist:', data.product);
      throw new Error('Product does not exist');
    }

    // Check current quantity in user's cart for this product
    const existingCartItems = await strapi.entityService.findMany('api::cart.cart', {
      filters: { product: data.product, user: data.user },
    });

    const existingQuantity = existingCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalRequested = existingQuantity + data.quantity;

    console.log(`📦 Product "${product.name}" (ID: ${product.id}) - stock: ${product.stock}, requested total: ${totalRequested}`);

    if (totalRequested > product.stock) {
      console.error(`❌ Cannot add ${data.quantity}. User already has ${existingQuantity} in cart. Stock is ${product.stock}`);
      throw new Error(`Cannot add ${data.quantity} units. You already have ${existingQuantity} in cart. Max stock is ${product.stock}.`);
    }

    console.log('✅ Stock check passed for beforeCreate.');
  },

  // Before updating an existing cart item
  async beforeUpdate(event) {
    const { data, where } = event.params;
    console.log('🛠️ [Cart Lifecycle] beforeUpdate triggered:', { data, where });

    // Fetch existing cart entry
    const cartEntry = await strapi.entityService.findOne('api::cart.cart', where.id);
    if (!cartEntry) {
      console.error('❌ Cart entry not found:', where.id);
      return;
    }

    const productId = data.product || cartEntry.product.id;
    const quantity = data.quantity || cartEntry.quantity;
    const userId = cartEntry.user.id;

    const product = await strapi.entityService.findOne('api::product.product', productId);
    if (!product) {
      console.error('❌ Product does not exist:', productId);
      throw new Error('Product does not exist');
    }

    // Check cumulative quantity excluding current cart entry
    const otherCartItems = await strapi.entityService.findMany('api::cart.cart', {
      filters: { product: productId, user: userId, id: { $ne: cartEntry.id } },
    });

    const otherQuantity = otherCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalRequested = otherQuantity + quantity;

    console.log(`📦 Product "${product.name}" (ID: ${product.id}) - stock: ${product.stock}, requested total after update: ${totalRequested}`);

    if (totalRequested > product.stock) {
      console.error(`❌ Cannot set quantity to ${quantity}. User has ${otherQuantity} in other cart items. Stock is ${product.stock}`);
      throw new Error(`Cannot set quantity to ${quantity}. Total in cart exceeds available stock of ${product.stock}.`);
    }

    console.log('✅ Stock check passed for beforeUpdate.');
  },
};
