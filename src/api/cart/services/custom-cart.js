'use strict';

module.exports = {
  async addItem(user, body) {
    if (!body.productId) {
      throw new Error('Product ID required');
    }

    return await strapi.entityService.create(
      'api::cart.cart',
      {
        data: {
          user: user.id,
          product: body.productId,
          quantity: body.quantity ,
        },
      }
    );
  },

  async getItems(user) {
    return await strapi.entityService.findMany(
      'api::cart.cart',
      {
        filters: { user: user.id },
        populate: ['product'],
      }
    );
  },

  async removeItem(id) {
    return await strapi.entityService.delete(
      'api::cart.cart',
      id
    );
  },
  async findWithRole(ctx, params = {}) {
    const role = ctx.state.user?.role?.type || 'public';

    // Admin → populate orders
    if (role === 'admin') {
      return await strapi.entityService.findMany(
        'api::product.product',
        {
          ...params,
          populate: ['orders'],
        }
      );
    }

    // Normal user → no orders
    const products = await strapi.entityService.findMany(
      'api::product.product',
      params
    );

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      Active: p.Active,
    }));
  },

  async findOneWithRole(ctx, id) {
    const role = ctx.state.user?.role?.type || 'public';

    // Admin → populate orders
    if (role === 'admin') {
      return await strapi.entityService.findOne(
        'api::product.product',
        id,
        { populate: ['orders'] }
      );
    }

    // Normal user → no orders
    const p = await strapi.entityService.findOne(
      'api::product.product',
      id
    );

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      Active: p.Active,
    };
  },
  async findWithRole(ctx, params = {}) {
    const role = ctx.state.user?.role?.type || 'public';

    // Admin → populate orders
    if (role === 'admin') {
      return await strapi.entityService.findMany(
        'api::product.product',
        {
          ...params,
          populate: ['orders'],
        }
      );
    }

    // Normal user → no orders
    const products = await strapi.entityService.findMany(
      'api::product.product',
      params
    );

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      Active: p.Active,
    }));
  },

  async findOneWithRole(ctx, id) {
    const role = ctx.state.user?.role?.type || 'public';

    // Admin → populate orders
    if (role === 'admin') {
      return await strapi.entityService.findOne(
        'api::product.product',
        id,
        { populate: ['orders'] }
      );
    }

    // Normal user → no orders
    const p = await strapi.entityService.findOne(
      'api::product.product',
      id
    );

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      Active: p.Active,
    };
  },
};
