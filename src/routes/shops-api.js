import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = shopService => ({
  findShops: async ctx => ctx.ok(await shopService.find(ctx.query)),
  getShop: async ctx => {
    const shop = await shopService.get(ctx.params.domain)
    shop.accessToken = null
    ctx.ok(shop)
  },
  createShop: async ctx =>
    ctx.created(await shopService.create(ctx.request.body)),
  updateShop: async ctx => {
    const shop = await shopService.update(ctx.params.domain, ctx.request.body)
    shop.accessToken = null
    ctx.ok(shop)
  },
  removeShop: async ctx =>
    ctx.noContent(await shopService.remove(ctx.params.domain)),
  setupShop: async ctx => ctx.ok(await shopService.setup(ctx.params.domain)),
  accept: async ctx => {
    ctx.redirect(await shopService.accept(ctx.params.domain, ctx.request.query.charge_id))
  }
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
const controller = createController(api)
  .prefix('/shops')
  .put('/:domain', 'updateShop')
  .get('/:domain', 'getShop')
  .get('/:domain/accept', 'accept')

if (process.env.NODE_ENV === 'development') {
  controller
    .get('', 'findShops')
    .post('', 'createShop')
    .post('/:domain/setup', 'setupShop')
    .delete('/:id', 'removeShop')
}
export default controller
