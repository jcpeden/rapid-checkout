import * as http from 'http'
import Koa from 'koa'
import cors from '@koa/cors'
import respond from 'koa-respond'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import koaStatic from 'koa-static'
import Router from 'koa-router'
import Webpack from 'webpack'
import koaWebpack from 'koa-webpack'

import { scopePerRequest, loadControllers } from 'awilix-koa'

import { logger } from './logger'
import { configureContainer } from './container'
import { notFoundHandler } from '../middleware/not-found'
import { errorHandler } from '../middleware/error-handler'
import { registerContext } from '../middleware/register-context'
import { env } from './env'
import { createDatabase } from './database'
import createShopStore from '../stores/shop-store'
import ShopService from '../services/shop-service'

import setupSSR from 'koa-nextjs'

import path from 'path'

// import next from 'next';
import session from 'koa-session'
require('isomorphic-fetch')

const dev = process.env.NODE_ENV === 'development'
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth')
const { verifyRequest } = require('@shopify/koa-shopify-auth')

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = env

/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Promise<http.Server>} The configured app.
 */
export async function createServer() {
  createDatabase()
  logger.debug('Creating server...')
  const app = new Koa()
  await setupSSR(app)

  // Container is configured with our services and whatnot.
  const container = (app.container = configureContainer())
  app
    // Handles CORS.
    .use(cors({ origin: '*' }))
    // session
    .use(session(app))
    // Top middleware is the error handler.
    .use(errorHandler)
    // Compress all responses.
    .use(compress())
    // Adds ctx.ok(), ctx.notFound(), etc..
    .use(respond())
    .use(koaStatic(path.resolve(__dirname, '..', '..', 'dist')))
    // Parses request bodies.
    .use(bodyParser())
    // Creates an Awilix scope per request. Check out the awilix-koa
    // docs for details: https://github.com/jeffijoe/awilix-koa
    .use(scopePerRequest(container))
    // Create a middleware to add request-specific data to the scope.
    .use(registerContext)

  app.use(loadControllers('../routes/*.js', { cwd: __dirname }))

  app.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_script_tags', 'write_script_tags'],
      accessMode: 'offline',
      afterAuth: async ctx => {
        const { shop, accessToken } = ctx.session
        const shopService = new ShopService(createShopStore(logger))
        let newShop = await shopService.findByDomain(shop)
        if (!newShop || typeof newShop._id === 'undefined') {
          newShop = await shopService.create({
            domain: shop,
            accessToken: accessToken,
            addToCartClick: ['showPopup'],
            showOnPage: ['productPage'],
            continueShoppingClick: ['closePopup'],
            customUrl: '',
            popupOptions: ['showGoToCartButton'],
            addToCartButtonProductPage: '#AddToCart',
            addToCartButtonCollectionPage: '#AddToCart',
            addToCartButtonHomePage: '#AddToCart'
          })
          await shopService.setup(newShop.domain)
        } else {
          await shopService.update(shop, {
            domain: shop,
            accessToken: accessToken
          })
          await shopService.setup(newShop.domain)
        }

        ctx.cookies.set('shopOrigin', shop, { httpOnly: false })
        const charge = await shopService.charge(shop)
        if (charge && charge.confirmation_url) {
          ctx.redirect(charge.confirmation_url)
        } else if (charge && charge.status === 'accepted') {
          ctx.redirect(charge.decorated_return_url)
        } else {
          ctx.redirect('https://' + shop + '/admin/apps/' + SHOPIFY_API_KEY)
        }
      }
    })
  )

  app.use(verifyRequest())
  const router = new Router()
  router.get('/', async ctx => {
    const shopService = new ShopService(createShopStore(logger))
    let currentShop = await shopService.findByDomain(ctx.cookies.get('shopOrigin'))
    await ctx.render({
      page: 'index', // path for a React component in `/pages/main/Home.js`
      props: {
        // only plain (serializable) JS primitives or objects.
        shop: currentShop
      },
      options: {
        // custom Next.js options
      }
    })
  })
  router.get('/support', async ctx => {
    await ctx.render({
      page: 'support', // path for a React component in `/pages/main/Home.js`
    })
  })
  app.use(router.routes())

  if (dev) {
    let webpackConfig = require('../../webpack.dev.js')
    const compiler = Webpack(webpackConfig)
    const webpackMiddleware = await koaWebpack({
      compiler
    })
    app.use(webpackMiddleware)
  }

  // Default handler when nothing stopped the chain.
  // Load routes (API "controllers")
  app.use(loadControllers('../routes/*.js', { cwd: __dirname }))
  app.use(notFoundHandler)

  app.keys = [SHOPIFY_API_SECRET_KEY]

  // Creates a http server ready to listen.
  const server = http.createServer(app.callback())

  // Add a `close` event listener so we can clean up resources.
  server.on('close', () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}
