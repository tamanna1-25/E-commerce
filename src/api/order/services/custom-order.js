'use strict';

module.exports = {
 async placeOrder(user) {
  if (!user) throw new Error('Unauthorized');

  const cartItems = await strapi.entityService.findMany(
    'api::cart.cart',
    {
      filters: { user: user.id },
      populate: ['product'],
    }
  );

  if (!cartItems.length) throw new Error('Cart is empty');

  // 1️⃣ Validate stock for ALL items
  for (const item of cartItems) {
    if (!item.product) {
      throw new Error(`Invalid product in cart`);
    }

    if (item.product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${item.product.name}`
      );
    }
  }

  let total = 0;

  // 2️⃣ Create order
  const order = await strapi.entityService.create(
    'api::order.order',
    {
      data: {
        user: user.id,
        total_amount: 0,
        status: 'pending',
        publishedAt: new Date(),
      },
    }
  );

  // 3️⃣ Create order items + reduce stock
  for (const item of cartItems) {
    const itemTotal = Number(item.product.price) * item.quantity;
    total += itemTotal;

    // ➖ Reduce stock
    await strapi.entityService.update(
      'api::product.product',
      item.product.id,
      {
        data: {
          stock: item.product.stock - item.quantity,
        },
      }
    );

    // 📦 Create order item
    await strapi.entityService.create(
      'api::order-item.order-item',
      {
        data: {
          order: order.id,
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        },
      }
    );
  }

  // 4️⃣ Update order total
  await strapi.entityService.update(
    'api::order.order',
    order.id,
    {
      data: { total_amount: total },
    }
  );

  // 5️⃣ Clear cart
  await Promise.all(
    cartItems.map(item =>
      strapi.entityService.delete('api::cart.cart', item.id)
    )
  );

  return await strapi.entityService.findOne(
    'api::order.order',
    order.id,
    {
      populate: ['items', 'items.product'],
    }
  );
}
,
  async getOrders(user) {
    return await strapi.entityService.findMany(
      'api::order.order',
      {
        filters: { user: user.id },
      }
    );
  },
  async placeSelected(user, cartItemIds) {
  if (!user) throw new Error('Unauthorized');
  if (!Array.isArray(cartItemIds) || !cartItemIds.length) {
    throw new Error('No cart items selected');
  }

  const cartItems = await strapi.entityService.findMany(
    'api::cart.cart',
    {
      filters: {
        id: { $in: cartItemIds },
        user: user.id,
      },
      populate: ['product'],
    }
  );

  if (!cartItems.length) throw new Error('Selected cart items not found');

  // 1️⃣ Validate stock
  for (const item of cartItems) {
    if (!item.product) {
      throw new Error(`Invalid cart item ${item.id}`);
    }

    if (item.product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${item.product.name}`
      );
    }
  }

  let total = 0;

  // 2️⃣ Create order
  const order = await strapi.entityService.create(
    'api::order.order',
    {
      data: {
        user: user.id,
        total_amount: 0,
        status: 'pending',
        publishedAt: new Date(),
      },
    }
  );

  // 3️⃣ Create order items + reduce stock
  for (const item of cartItems) {
    const itemTotal = Number(item.product.price) * item.quantity;
    total += itemTotal;

    // ➖ Reduce stock
    await strapi.entityService.update(
      'api::product.product',
      item.product.id,
      {
        data: {
          stock: item.product.stock - item.quantity,
        },
      }
    );

    await strapi.entityService.create(
      'api::order-item.order-item',
      {
        data: {
          order: order.id,
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        },
      }
    );
  }

  // 4️⃣ Update total
  await strapi.entityService.update(
    'api::order.order',
    order.id,
    {
      data: { total_amount: total },
    }
  );

  // 5️⃣ Delete selected cart items
  await Promise.all(
    cartItems.map(item =>
      strapi.entityService.delete('api::cart.cart', item.id)
    )
  );

  return await strapi.entityService.findOne(
    'api::order.order',
    order.id,
    {
      populate: ['items', 'items.product'],
    }
  );
}

};
