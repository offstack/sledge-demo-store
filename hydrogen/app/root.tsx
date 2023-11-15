import {
  defer,
  type LinksFunction,
  type LoaderArgs,
  type AppLoadContext,
  SerializeFrom,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  ScrollRestoration,
  useLoaderData,
  type ShouldRevalidateFunction,
  useLocation,
  useRouteError,
  useRouteLoaderData,
  isRouteErrorResponse,
  useMatches,
} from '@remix-run/react';

import styles from './styles/tailwind.css';
import favicon from '../public/favicon.png';
import {Layout} from './components/Layout';
import {seoPayload} from '~/lib/seo.server';

//from shopify demo-store templates
import invariant from 'tiny-invariant';
import {DEFAULT_LOCALE, getCartId, parseMenu} from './lib/utils';
import {
  ShopifySalesChannel,
  Seo,
  useNonce,
  parseGid,
  Script,
} from '@shopify/hydrogen';
import {useAnalytics} from './hooks/useAnalytics';
import {cssBundleHref} from '@remix-run/css-bundle';

//SLEDGE PACKAGE
import {SledgeProvider} from '@sledge-app/core';
import sledgeCss from '@sledge-app/core/style.css';

//Sledge Custom Css
import sledgeDarkCss from '~/styles/sledge-dark.css';
import {useEffect} from 'react';

import * as gtag from '~/lib/gtags.client';
import {GenericError} from './components/Pages/GenericError';
import {NotFound} from './components/Pages/NotFound';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
    {rel: 'stylesheet', href: sledgeCss},
    {rel: 'stylesheet', href: sledgeDarkCss},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({request, context}: LoaderArgs) {
  const {session, storefront, cart} = context;
  const cartId = getCartId(request);

  const [customerAccessToken, layout] = await Promise.all([
    session.get('customerAccessToken'),
    getLayoutData(context),
  ]);

  const seo = seoPayload.root({shop: layout.shop, url: request.url});

  const {customer} = await storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken: customerAccessToken ? customerAccessToken : '',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  const gaTrackingId = context.env.GA_TRACKING_ID;

  return defer({
    isLoggedIn: Boolean(customerAccessToken),
    customer,
    layout,
    sledgeApiKey: context.env.SLEDGE_API_KEY,
    sledgeInstantSearchApiKey: context.env.SLEDGE_INSTANT_SEARCH_API_KEY,
    selectedLocale: storefront.i18n,
    cart: cartId ? getCart(context, cartId) : undefined,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: layout.shop.id,
    },
    seo,
    gaTrackingId,
  });
}

export default function App() {
  const nonce = useNonce();
  const {
    selectedLocale,
    layout,
    customer,
    sledgeApiKey,
    sledgeInstantSearchApiKey,
  } = useLoaderData<typeof loader>();
  const locale = selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;

  const {pathname} = useLocation();

  let productClass = '';

  if (pathname.split('/').length && pathname.split('/')[1] === 'products')
    productClass = 'template-product';

  useAnalytics(hasUserConsent);

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body className={`bg-dark text-white antialiased ${productClass}`}>
        <GoogleAnalyticsScript />
        <script src="https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js" />
        <SledgeProvider
          apiKey={sledgeApiKey}
          instantSearchApiKey={sledgeInstantSearchApiKey}
          userId={parseGid(customer?.id).id}
          userEmail={customer?.email}
          userFullname={
            customer?.firstName || customer?.lastName
              ? (customer?.firstName ? customer?.firstName + ' ' : '') +
                (customer?.lastName ? customer?.lastName : '')
              : ''
          }
        >
          <Layout key={`${locale.language}-${locale.country}`} layout={layout}>
            <Outlet />
          </Layout>
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
          <LiveReload nonce={nonce} />
        </SledgeProvider>
      </body>
    </html>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const nonce = useNonce();
  const routeError = useRouteError();
  const rootData = useRootLoaderData();
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Whoops! Something Wrong.';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <html className="h-full" lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-dark h-full">
        <div className="min-h-screen h-full lg:h-fit">
          {isRouteError ? (
            <>
              {routeError.status === 404 ? (
                <NotFound type={pageType} />
              ) : (
                <GenericError
                  error={{message: `${routeError.status} ${routeError.data}`}}
                />
              )}
            </>
          ) : (
            <GenericError error={error instanceof Error ? error : undefined} />
          )}
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function GoogleAnalyticsScript() {
  const {gaTrackingId} = useLoaderData<typeof loader>();
  const location = useLocation();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location.pathname, gaTrackingId]);

  return !gaTrackingId ? null : (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <Script
        async
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gaTrackingId}', {
                page_path: window.location.pathname,
              });
            `,
        }}
      />
    </>
  );
}

async function getLayoutData({storefront, env}: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      footerMenuHandle: 'footer',
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(
        data.headerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(
        data.footerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  return {shop: data.shop, headerMenu, footerMenu};
}

export async function getCart({storefront}: AppLoadContext, cartId: string) {
  invariant(storefront, 'missing storefront client in cart query');

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const CART_QUERY = `#graphql
  query cartQuery($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              availableForSale
              sku
              quantityAvailable
              compareAtPrice {
                ...MoneyFragment
              }
              price {
                ...MoneyFragment
              }
              requiresShipping
              title
              image {
                ...ImageFragment
              }
              product {
                handle
                vendor
                title
                id
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
    }
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
` as const;

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerDetails
    }
  }

  fragment CustomerDetails on Customer {
    id
    firstName
    lastName
    phone
    email
  }
` as const;
