'use strict';
const _ = require('lodash');
const type = 'doc'
// console.log('strapi.hook', strapi.hook['strapi-hook-elastic'].load())
module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  // afterSave: async (model, result) => {
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

    // const item = model.attributes.map(item => {
    //   // console.log(item)
    //   return item
    // })

    // console.log(model.attributes)
    // console.log(strapi.config.hook.settings['strapi-hook-elastic'].db.type)
    await strapi.hook['strapi-hook-elastic'].elastic.createDocument(strapi.config.hook.settings['strapi-hook-elastic'].db.type, {
      name: model.attributes.name,
      description: model.attributes.description,
      SKU: model.attributes.SKU,
      id: model.attributes.id
    })
  },

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model) => {},

  // After updating a value.
  // Fired after an `update` query.
  afterUpdate: async (model, result) => {

    let item = await strapi.services.product.fetch({
      id: model.id
    })
    item.attributes.filters = _.omit(item.attributes.filters, '')
    // console.log(item.attributes.filters)
    const imageId = item.relations.img && item.relations.img.id ? item.relations.img.id : null
    const image = imageId ? await strapi.plugins['upload'].services.upload.fetch({
      id: imageId
    }) : null

    const attrs = _.omit(item.attributes, "created_at", "updated_at")
    const addObj = {
      img: image ? strapi.config.url + image.url : null,
      category: item.relations.category && item.relations.category.id ? item.relations.category.id : null,
      manufacturer: item.relations.manufacturer && item.relations.manufacturer.id ? item.relations.manufacturer.id : null
    }
    const returnObj = {
      ...addObj,
      ...attrs
    }
    // console.log(returnObj)
    if (!model.attributes.name) {} else {

      strapi.hook['strapi-hook-elastic'].elastic.updateDocument(strapi.config.hook.settings['strapi-hook-elastic'].db.type, returnObj)

      // {
      //   name: model.attributes.name,
      //   description: model.attributes.description,
      //   SKU: model.attributes.SKU,
      //   id: model.attributes.id,
      //   slug: model.attributes.slug
      // }
      //       PUT my_index2
      // {

      //   "mappings": {
      //     "_doc": { 
      //       "properties": { 
      //         "img":    { "type": "text"  }, 
      //         "category":     { "type": "integer"  }, 
      //         "manufacturer":      { "type": "integer" },  
      //         "id":      { "type": "integer" },  
      //         "name":      { "type": "text" },
      //         "description":      { "type": "text" },
      //         "SKU":      { "type": "text" },
      //         "filters":      { "type": "nested" },
      //         "slug":      { "type": "text" }
      //       }
      //     }
      //   }
      // }
    }

  },
  // Before destroying a value.
  // Fired before a `delete` query.
  beforeDestroy: async (model) => {
    const items = await strapi.hook['strapi-hook-elastic'].elastic.getDocuments('doc', {
      query: {
        match: {
          _id: model.attributes.id,
        }
      }
    })
    if (items.length > 0) {
      await strapi.hook['strapi-hook-elastic'].elastic.deleteDocument('doc', model.attributes.id)
    }

  },

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, result) => {


  // }

};
