import {Link} from '~/components';
import {flattenConnection, Image} from '@shopify/hydrogen';

import type {OrderCardFragment} from 'storefrontapi.generated';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}: {order: OrderCardFragment}) {
  if (!order?.id) return null;
  const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?');
  const lineItems = flattenConnection(order?.lineItems);

  return (
    <li className="grid text-center border border-dark2 rounded">
      <Link
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        to={`/account/orders/${legacyOrderId}?${key}`}
        prefetch="intent"
      >
        {lineItems[0].variant?.image && (
          <div className="card-image aspect-square bg-primary/5">
            <Image
              width={168}
              height={168}
              className="w-full fadeIn cover"
              alt={lineItems[0].variant?.image?.altText ?? 'Order image'}
              src={lineItems[0].variant?.image.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems[0].variant?.image && 'md:col-span-2'
          }`}
        >
          <h5>
            {lineItems.length > 1
              ? `${lineItems[0].title} +${lineItems.length - 1} more`
              : lineItems[0].title}
          </h5>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <p>Order No. {order.orderNumber}</p>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <p>{new Date(order.processedAt).toDateString()}</p>
            </dd>
            <dt className="sr-only">Fulfillment Status</dt>
            <dd className="mt-2">
              <span
                className={`w-fit block px-3 py-1 text-xs font-medium rounded-full ${
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green/20 text-green-800'
                    : 'bg-gray-500/50 text-white'
                }`}
              >
                <p>{statusMessage(order.fulfillmentStatus)}</p>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
      <div className="self-end border-t border-dark2">
        <Link
          className="block w-full p-2 text-center"
          to={`/account/orders/${legacyOrderId}?${key}`}
          prefetch="intent"
        >
          <p className="ml-3">View Details</p>
        </Link>
      </div>
    </li>
  );
}

export const ORDER_CARD_FRAGMENT = `#graphql
  fragment OrderCard on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          variant {
            image {
              url
              altText
              height
              width
            }
          }
          title
        }
      }
    }
  }
`;
