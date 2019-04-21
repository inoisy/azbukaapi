'use strict';
const _ = require('lodash');
const ElasticsearchAdapter = require("../../adapter.js")
// var elasticClient = new elasticsearch.Client({
//   host: 'localhost:9200',
//   // log: 'trace'
// });

/**
 * Lifecycle callbacks for the `Product` model.
 */
const elastic = new ElasticsearchAdapter({
  db: {
    url: 'http://localhost:9200',
    indexName: "productsearch"
  }
});
elastic.connect((done) => console.log("done"))
module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  // afterSave: async (model, result) => {
  //   console.log('afterSavemodel', model._update)
  //   console.log('afterSaveresult', model.result)
  //   const item = await strapi.services.product.fetch({
  //     _id: model._conditions._id
  //   })
  //   console.log('item', item)
  // },

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, results) => {},

  // Fired before a `fetch` operation.
  // beforeFetch: async (model) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, result) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model) => {},

  // After creating a value.
  // Fired after an `insert` query.
  afterCreate: async (model, result) => {
    console.log('afterCreate')
    // console.log('model', model)
    console.log('result', result)
    // const newObj = _.omit(result, ['_id'])

    // console.log('fetch', await strapi.services.product.fetch({
    //   id: result.id
    // }))
    // await elastic.createDocument('categories', result)
  },

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model) => {},

  // After updating a value.
  // Fired after an `update` query.
  afterUpdate: async (model, result) => {
    console.log('model', model._update)
    // console.log('model', result)
    const item = await strapi.services.product.fetch({
      _id: model._conditions._id
    })
    console.log('item', item)
    if (item && item._id) {
      console.log("afterUpdate UPDATE", model._conditions._id)
      const newItem = _.pick(item, ['id', 'name', 'description', 'createdAt', 'updatedAt'])
      newItem.category = item.category && item.category.id ? item.category.id : ''
      console.log('fetch', newItem)
      //   await elastic.updateDocument('item', newItem)
      // } else if (model._update.id) {
      //   let newItem = _.pick(item, ['_id', 'id', 'name', 'description', 'createdAt', 'updatedAt'])
      //   newItem.category = model._update.category || ''
      await elastic.createDocument('item', newItem)
    } else if (!item._id) {
      const id = String(model._conditions._id).trim()
      console.log("afterUpdate DELETED", id)
      await elastic.deleteDocument('item', id)
    }
  },
  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model) => {
  //   console.log('beforeDestroy')
  // },

  // After destroying a value.
  // Fired after a `delete` query.
  afterDestroy: async (model, result) => {
    console.log('afterDestroymodel',
      model)

    console.log('afterDestroyresult',
      result)

  }

};
