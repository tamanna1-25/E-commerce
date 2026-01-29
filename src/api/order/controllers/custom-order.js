'use strict';

module.exports = {
  async place(ctx) {
    try {
      const data = await strapi
        .service('api::order.custom-order')
        .placeOrder(ctx.state.user);

      ctx.send({ success: true, data });
    } catch (err) {
      ctx.badRequest(err.message);
    }
  },

  async list(ctx) {
    const data = await strapi
      .service('api::order.custom-order')
      .getOrders(ctx.state.user);

    ctx.send({ success: true, data });
  },
  async placeSelected(ctx) {
  try {
    const user = ctx.state.user;
    const { cartItemIds } = ctx.request.body;

    const data = await strapi
      .service('api::order.custom-order')
      .placeSelected(user, cartItemIds);

    ctx.send({ success: true, data });
  } catch (err) {
    ctx.badRequest(err.message);
  }
}

};
