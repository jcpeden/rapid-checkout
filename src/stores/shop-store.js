import Shop from '../models/shop'
/**
 * Mongodb shop store
 * For demo purposes, gets the logger injected.
 */
export default function createShopStore(logger) {
  return {
    async find() {
      logger.debug('Finding shops')
      return Shop.find()
    },

    async findByDomain(domain) {
      logger.debug(`Getting shop with domain ${domain}`)
      const found = await Shop.findByDomain(domain)
      if (!found) {
        return null
      }
      return found
    },

    async get(id) {
      logger.debug(`Getting shop with id ${id}`)
      const found = await Shop.findById(id)
      if (!found) {
        return null
      }
      return found
    },

    async create(data) {
      const shop = new Shop(data)
      const error = await shop.save()
      if (!error) {
        return shop
      }
      return error
    },

    async update(id, data) {
      const shop = await this.get(id)
      // const shop = Shop.findByIdAndUpdate(id, {$set: data});
      Object.assign(shop, data)
      await shop.save()
      const result = await this.get(id)
      return result
    },

    async remove(id) {
      Shop.findOneAndRemove({ id: id })
      logger.debug(`Removed shop ${id}`)
    }
  }
}
