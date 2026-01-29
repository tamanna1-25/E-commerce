'use strict';

module.exports = {
  async createp(ctx) {
    try {
      const { name, price, stock } = ctx.request.body;

      if (!name || !price) {
        return ctx.badRequest('Name and price are required');
      }

      const product = await strapi
        .service('api::product.custom-product')
        .createProduct({ name, price, stock });

      ctx.send({
        success: true,
        data: product
      });

    } catch (err) {
      ctx.internalServerError(err.message);
    }
  },

  // async findp(ctx) {
  //   const products = await strapi
  //     .service('api::product.custom-product')
  //     .getProducts();

  //   ctx.send({ success: true, data: products });
  // },

  // async findOnep(ctx) {
  //   const { id } = ctx.params;

  //   const product = await strapi
  //     .service('api::product.custom-product')
  //     .getProductById(id);

  //   if (!product) {
  //     return ctx.notFound('Product not found');
  //   }

  //   ctx.send({ success: true, data: product });
  // },
   async updatep(ctx) {
    try {
      const { id } = ctx.params;
      const { name, price, stock } = ctx.request.body;

      const updatedProduct = await strapi
        .service('api::product.product')
        .update(id, { data: { name, price, stock } });

      ctx.send({
        success: true,
        data: updatedProduct,
      });
    } catch (err) {
      ctx.badRequest('Failed to update product', { error: err.message });
    }
  },

  // Delete product
  async deletep(ctx) {
    try {
      const { id } = ctx.params;

      await strapi.service('api::product.product').delete(id);

      ctx.send({
        success: true,
        message: `Product ${id} deleted successfully`,
      });
    } catch (err) {
      ctx.badRequest('Failed to delete product', { error: err.message });
    }
  },
  async listProducts(ctx) {
    const products = await strapi
      .service('api::product.custom-product')
      .fetchAllProducts();

    ctx.send({ success: true, data: products });
  },

  async getProductById(ctx) {
    const { id } = ctx.params;

    const product = await strapi
      .service('api::product.custom-product')
      .fetchProductById(id);

    ctx.send({ success: true, data: product });
  },
  async publicList(ctx) {
  const products = await strapi
    .service('api::product.custom-product')
    .getPublicProducts(ctx);

  ctx.send({ success: true, data: products });
},

async publicFindOne(ctx) {
  const { id } = ctx.params;
  console.log('params:', ctx.params);
  const product = await strapi
    .service('api::product.custom-product')
    .getPublicProductById(id, ctx);

  if (!product) {
    return ctx.notFound('Product not found');
  }

  ctx.send({ success: true, data: product });
},
async publicFindName(ctx) {
  const { name } = ctx.params;
  console.log('params:', ctx.params);

  if (!name) {
    return ctx.badRequest('Name parameter is required');
  }
  const product = await strapi
    .service('api::product.custom-product')
    .getPublicProductByName(name, ctx);

  if (!product) {
    return ctx.notFound('Product not found');
  }

  ctx.send({ success: true, data: product });
},
};
