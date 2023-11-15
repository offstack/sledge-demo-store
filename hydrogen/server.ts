// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {createRequestHandler} from '@remix-run/server-runtime';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';

import {HydrogenSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

/**
 * Export a fetch handler in module format.
 */
export default async function (request: Request): Promise {
  try {
    /**
     * This has to be done so messy because process.env can't be destructured
     * and only variables explicitly named are present inside a Vercel Edge Function.
     * See https://github.com/vercel/next.js/pull/31237/files
     */
    const env: Env = {
      SESSION_SECRET: '',
      PUBLIC_STOREFRONT_API_TOKEN: '',
      PRIVATE_STOREFRONT_API_TOKEN: '',
      PUBLIC_STORE_DOMAIN: '',
      PRIVATE_ADMIN_API_TOKEN: '',
      PRIVATE_ADMIN_API_VERSION: '',
      PUBLIC_STOREFRONT_ID: '',
      SLEDGE_API_KEY: '',
      SLEDGE_INSTANT_SEARCH_API_KEY: '',
      GA_TRACKING_ID: '',
    };

    env.SESSION_SECRET = process.env.SESSION_SECRET as string;
    env.PUBLIC_STOREFRONT_API_TOKEN = process.env
      .PUBLIC_STOREFRONT_API_TOKEN as string;
    env.PRIVATE_STOREFRONT_API_TOKEN = process.env
      .PRIVATE_STOREFRONT_API_TOKEN as string;
    env.PUBLIC_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN as string;
    env.PRIVATE_ADMIN_API_TOKEN = process.env.PRIVATE_ADMIN_API_TOKEN as string;
    env.PRIVATE_ADMIN_API_VERSION = process.env
      .PRIVATE_ADMIN_API_VERSION as string;
    env.SLEDGE_API_KEY = process.env.SLEDGE_API_KEY;
    env.SLEDGE_INSTANT_SEARCH_API_KEY =
      process.env.SLEDGE_INSTANT_SEARCH_API_KEY;
    env.GA_TRACKING_ID = process.env.GA_TRACKING_ID;

    /**
     * Open a cache instance in the worker and a custom session instance.
     */
    if (!env?.SESSION_SECRET) {
      throw new Error('SESSION_SECRET process.environment variable is not set');
    }

    const [session] = await Promise.all([
      HydrogenSession.init(request, [process.env.SESSION_SECRET as string]),
    ]);

    /**
     * Create Hydrogen's Storefront client.
     */
    const {storefront} = createStorefrontClient({
      buyerIp: request.headers.get('x-forwarded-for') ?? undefined,
      i18n: getLocaleFromRequest(request),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      // storefrontId: process.env.PUBLIC_STOREFRONT_ID,
      // requestGroupId: request.headers.get('request-id'),
    });

    const cart = createCartHandler({
      storefront,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });

    const handleRequest = createRequestHandler(remixBuild as any, 'production');

    const response = await handleRequest(request, {
      session,
      storefront,
      cart,
      env,
      waitUntil: () => Promise.resolve(),
    });

    if (response.status === 404) {
      /**
       * Check for redirects only when there's a 404 from the app.
       * If the redirect doesn't exist, then `storefrontRedirect`
       * will pass through the 404 response.
       */
      // return storefrontRedirect({request, response, storefront});
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
}
