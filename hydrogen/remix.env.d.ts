/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type {WithCache, HydrogenCart} from '@shopify/hydrogen';
import type {Storefront} from '~/lib/type';
import type {HydrogenSession} from '~/lib/session.server';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */

  const process: {
    env: {
      PUBLIC_STOREFRONT_API_TOKEN: string;
      PRIVATE_STOREFRONT_API_TOKEN: string;
      PUBLIC_STORE_DOMAIN: string;
      PRIVATE_ADMIN_API_VERSION: string;
      PRIVATE_ADMIN_API_TOKEN: string;
      SESSION_SECRET: string;
      SLEDGE_API_KEY: string;
      SLEDGE_INSTANT_SEARCH_API_KEY: string;
      NODE_ENV: 'production' | 'development';
      GA_TRACKING_ID: string;
    } & Env;
  };

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PRIVATE_ADMIN_API_TOKEN: string;
    PRIVATE_ADMIN_API_VERSION: string;
    PUBLIC_STOREFRONT_ID: string;
    SLEDGE_API_KEY: string;
    SLEDGE_INSTANT_SEARCH_API_KEY: string;
    GA_TRACKING_ID: string;
  }
}

/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.ts`.
 */
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil'];
    session: HydrogenSession;
    storefront: Storefront;
    cart: HydrogenCart;
    env: Env;
  }
}

// Needed to make this file a module.
export {};
