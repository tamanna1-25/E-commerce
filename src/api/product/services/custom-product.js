'use strict';
const isAdmin = (ctx) =>
  ctx?.state?.user?.role?.name === 'Admin';

// helper: public response shape
const pickPublicFields = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  Active: product.Active,
});

module.exports = {
  async createProduct(data) {
    return await strapi.entityService.create(
      'api::product.product',
      { data }
    );
  },

  async getProducts() {
    return await strapi.entityService.findMany(
      'api::product.product',
      {
        filters: { is_active: true }
      }
    );
  },

  async getProductById(id) {
    return await strapi.entityService.findOne(
      'api::product.product',
      id
    );
  },
  async fetchAllProducts() {
    return await strapi.entityService.findMany(
      'api::product.product'
    );
  },

  async fetchProductById(id) {
    return await strapi.entityService.findOne(
      'api::product.product',
      id
    );
  },
  
  async getPublicProducts(ctx) {
  const isAdminUser = isAdmin(ctx);

  return await strapi.entityService.findMany(
    'api::product.product',
    {
      filters: { Active: true },

      ...(isAdminUser
        ? {
            // 🛠 Admin: full access + order details
            populate: {
              order_items: {
                populate: {
                  order: true,
                },
              },
            },
          }
        : {
            // 👤 Public: only selected fields
            fields: ['id', 'name', 'price', 'Active'],
          }),
    }
  );
}

,
  async getPublicProductById(id, ctx) {
  const isAdminUser = isAdmin(ctx);

  return await strapi.entityService.findOne(
    'api::product.product',
    id,
    isAdminUser
      ? {
          populate: {
            order_items: {
              populate: {
                order: true,
              },
            },
          },
        }
      : {
          fields: ['id', 'name', 'price', 'Active'],
        }
  );
}
,

  async getPublicProductByName(name, ctx) {
  const isAdminUser = isAdmin(ctx);

  const products = await strapi.entityService.findMany(
    'api::product.product',
    {
      filters: {
        name: { $eqi: name },
        Active: true,
      },

      ...(isAdminUser
        ? {
            populate: {
              order_items: {
                populate: {
                  order: true,
                },
              },
            },
          }
        : {
            fields: ['id', 'name', 'price', 'Active'],
          }),
    }
  );

  return products?.[0] || null;
}
,

  
};
