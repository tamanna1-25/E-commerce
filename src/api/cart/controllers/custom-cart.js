'use strict';

module.exports = {
  async add(ctx) {
    try {
      const data = await strapi
        .service('api::cart.custom-cart')
        .addItem(ctx.state.user, ctx.request.body);

      ctx.send({ success: true, data });
    } catch (err) {
      ctx.badRequest(err.message);
    }
  },

  async view(ctx) {
    const data = await strapi
      .service('api::cart.custom-cart')
      .getItems(ctx.state.user);

    ctx.send({ success: true, data });
  },

  async remove(ctx) {
    await strapi
      .service('api::cart.custom-cart')
      .removeItem(ctx.params.id);
    console.log('🔥 CUSTOM CART REMOVE HIT', ctx.params.id);
    ctx.send({ success: true, message: 'Item removed' });
  },
   async find(ctx) {
    ctx.body = await strapi
      .service('product-filter')
      .findWithRole(ctx, ctx.query);
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    ctx.body = await strapi
      .service('product-filter')
      .findOneWithRole(ctx, id);
  },
  
};
