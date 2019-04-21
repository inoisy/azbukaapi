'use strict';

/**
 * Manufacturer.js controller
 *
 * @description: A set of functions called "actions" for managing `Manufacturer`.
 */

module.exports = {

  /**
   * Retrieve manufacturer records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.manufacturer.search(ctx.query);
    } else {
      return strapi.services.manufacturer.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a manufacturer record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.manufacturer.fetch(ctx.params);
  },

  /**
   * Count manufacturer records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.manufacturer.count(ctx.query);
  },

  /**
   * Create a/an manufacturer record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.manufacturer.add(ctx.request.body);
  },

  /**
   * Update a/an manufacturer record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.manufacturer.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an manufacturer record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.manufacturer.remove(ctx.params);
  }
};
