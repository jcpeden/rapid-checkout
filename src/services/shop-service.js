import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'
import { env } from '../lib/env'
import Shopify from 'shopify-api-node'

// Prevent overposting.
const pickProps = data =>
  pick(data, [
    'domain',
    'accessToken',
    'addToCartClick',
    'showOnPage',
    'continueShoppingClick',
    'customUrl',
    'popupOptions',
    'addToCartButtonProductPage',
    'addToCartButtonCollectionPage',
    'addToCartButtonHomePage',
    'style'
  ])

/**
 * Shop Service.
 * Gets a shop store injected.
 */
export default class ShopService {
  constructor(shopStore) {
    this.shopStore = shopStore
  }

  async find(params) {
    return this.shopStore.find(params)
  }

  async get(domain) {
    // If `shopStore.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    const shop = await this.shopStore
      .findByDomain(domain)
    if (shop) {
      const result = {
        ...shop._doc,
        style: shop.style
      }
      return result
    }
    return null
  }

  async setup(id) {
    const shop = await this.get(id)
    const shopify = new Shopify({
      shopName: shop.domain,
      accessToken: shop.accessToken
    })
    const src = env.BASE_URL + '/main.js'
    const list = await shopify.scriptTag.list({
      src
    })
    if (list.length === 0) {
      const response = await shopify.scriptTag.create({
        event: 'onload',
        src
      })
      return { result: [response] }
    }
    return { result: list }
  }

  async charge(id) {
    const shop = await this.get(id)
    const shopify = new Shopify({
      shopName: shop.domain,
      accessToken: shop.accessToken
    })
    let charges = await shopify.recurringApplicationCharge.list({})
    charges = charges.filter(c => c.status !== 'cancelled')
    if (charges.length === 0) {
      const charge = await shopify.recurringApplicationCharge.create({
        test: env.TEST,
        trial_days: env.TRIAL_DAYS,
        name: env.APP,
        price: env.PRICE,
        return_url: env.BASE_URL + '/shops/' + shop.domain + '/accept'
      })
      return charge
    } else {
      const charge = charges[0]
      if (!charge.activated_on) {
        return charge
      }
    }
    return null
  }

  async accept(id, chargeId) {
    const shop = await this.get(id)
    const shopify = new Shopify({
      shopName: shop.domain,
      accessToken: shop.accessToken
    })
    try {
      const result = await shopify.recurringApplicationCharge.activate(chargeId)
    } catch (e) {
    }
    return 'https://' + shop.domain + '/admin/apps/' + env.APP_NAME
  }

  async create(data) {
    BadRequest.assert(data, 'No shop payload given')
    return this.shopStore.create(pickProps(data))
  }

  async update(domain, data) {
    BadRequest.assert(data, 'No shop payload given')

    // Make sure the shop exists by calling `get`.
    const shop = await this.get(domain)

    // Prevent overposting.
    const picked = pickProps(data)
    return this.shopStore.update(shop._id, picked)
  }

  async remove(id) {
    // Make sure the shop exists by calling `get`.
    await this.get(id)
    return this.shopStore.remove(id)
  }

  async findByDomain(domain) {
    return this.get(domain)
  }
}
