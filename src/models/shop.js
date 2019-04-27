'use strict'

import uniqueValidator from 'mongoose-unique-validator'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// type: filed type, String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
// index: is database index needed for the filed, pay attention to unique index
// default: the default value
const Shop = new Schema({
  domain: {
    type: String,
    index: { unique: true, dropDups: false },
    unique: true
  },
  accessToken: { type: String, match: /\w+/, index: true },
  addToCartClick: { type: Array },
  showOnPage: { type: Array },
  continueShoppingClick: { type: Array },
  customUrl: { type: String },
  popupOptions: { type: Array },
  addToCartButtonProductPage: { type: String },
  addToCartButtonCollectionPage: { type: String },
  addToCartButtonHomePage: { type: String },
  style: {
    type: String,
    get: v => JSON.parse(v || '{}'),
    set: (v) => {
      if (typeof v === "object") {
        return JSON.stringify(v)
      }
      return v
    }
  },
  created: { type: Date, default: Date.now, index: true },
  updated: { type: Date, default: Date.now, index: true }
})

// user middleware to auto update the field 'updated' while you changed any other things
Shop.pre('save', function(next) {
  this.updated = Date.now()
  next()
})

// Static method: find an shop by domain
// use findOne method here becase we just need to query one record
Shop.statics.findByDomain = async function(domain) {
  return await this.findOne({ domain: domain })
}

Shop.plugin(uniqueValidator)

// create the model
const model = mongoose.model('Shop', Shop)

module.exports = model
