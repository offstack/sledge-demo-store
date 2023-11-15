import {
  Outlet,
  useFetcher,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {
  json,
  defer,
  redirect,
  type LoaderArgs,
  type AppLoadContext,
} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';

import type {
  CustomerDetailsFragment,
  OrderCardFragment,
} from 'storefrontapi.generated';
import {
  AccountDetails,
  AccountAddressBook,
  Button,
  OrderCard,
} from '~/components';
import {ORDER_CARD_FRAGMENT} from '~/data/fragments';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';

import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';
import {doLogout} from './($locale).account.logout';
import {Modal} from '~/components/Global/Modal';

// Combining json + Response + defer in a loader breaks the
// types returned by useLoaderData. This is a temporary fix.
type TmpRemixFix = ReturnType<typeof defer<{isAuthenticated: false}>>;

export const headers = routeHeaders;

export async function loader({request, context, params}: LoaderArgs) {
  const {pathname} = new URL(request.url);
  const locale = params.locale;
  const customerAccessToken = await context.session.get('customerAccessToken');
  const isAuthenticated = Boolean(customerAccessToken);
  const loginPath = locale ? `/${locale}/account/login` : '/account/login';
  const isAccountPage = /^\/account\/?$/.test(pathname);

  if (!isAuthenticated) {
    if (isAccountPage) {
      return redirect(loginPath) as unknown as TmpRemixFix;
    }
    // pass through to public routes
    return json({isAuthenticated: false}) as unknown as TmpRemixFix;
  }

  const customer = await getCustomer(context, customerAccessToken);

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return defer(
    {
      isAuthenticated,
      customer,
      heading,
      featuredData: getFeaturedData(context.storefront),
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const matches = useMatches();

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    return match?.handle?.renderInModal;
  });

  // Public routes
  if (!data.isAuthenticated) {
    return <Outlet />;
  }

  // Authenticated routes
  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal cancelLink="/account">
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Account {...data} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...data} />;
}

interface AccountType {
  customer: CustomerDetailsFragment;
  featuredData: Promise<FeaturedData>;
  heading: string;
}

function Account({customer, heading, featuredData}: AccountType) {
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);

  const fetcher = useFetcher();

  return (
    <>
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 mt-[40.5px]">
        <h1 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
          {heading}
        </h1>
        <fetcher.Form
          method="post"
          action={usePrefixPathWithLocale('/account/logout')}
        >
          <Button
            isArrow={false}
            className={'my-[20px]'}
            text="Sign out"
            type={'submit'}
            loading={fetcher.state}
          />
        </fetcher.Form>
      </div>
      {orders && <AccountOrderHistory orders={orders} />}
      <AccountDetails customer={customer} />
      <AccountAddressBook addresses={addresses} customer={customer} />
    </>
  );
}

type OrderCardsProps = {
  orders: OrderCardFragment[];
};

function AccountOrderHistory({orders}: OrderCardsProps) {
  return (
    <div className={`${orders?.length ? 'mt-6' : ''}`}>
      <div
        className={`max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 grid w-full gap-4 ${
          orders?.length ? 'md:gap-8' : 'md:gap-5'
        } `}
      >
        {!orders?.length ? null : (
          <h2 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
            Order History
          </h2>
        )}
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <>
      <p className="text-dark4">You haven't placed any orders yet.</p>
      <Button
        text="Start Shopping"
        className="!w-fit"
        to={'/pages/search-result'}
      />
    </>
  );
}

function Orders({orders}: OrderCardsProps) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 false sm:grid-cols-3">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}

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

  fragment AddressPartial on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }

  fragment CustomerDetails on Customer {
    firstName
    lastName
    phone
    email
    defaultAddress {
      ...AddressPartial
    }
    addresses(first: 6) {
      edges {
        node {
          ...AddressPartial
        }
      }
    }
    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...OrderCard
        }
      }
    }
  }

  ${ORDER_CARD_FRAGMENT}
` as const;

export async function getCustomer(
  context: AppLoadContext,
  customerAccessToken: string,
) {
  const {storefront} = context;

  const data = await storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (!data || !data.customer) {
    throw await doLogout(context);
  }

  return data.customer;
}
