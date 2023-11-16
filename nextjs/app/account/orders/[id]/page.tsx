import { Button, Link } from "components/global";
import Price from "components/price";
import { getCustomerOrders } from "lib/shopify";
import { statusMessage } from "lib/utils";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Order",
};

export default async function Page({ params, searchParams }: any) {
  const orderId = `gid://shopify/Order/${params.id}?key=${searchParams.key}`;

  const { data }: any = await getCustomerOrders(orderId);
  const order = data.node;

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <div>
        <h1 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
          Order detail
        </h1>
        <div className="my-[22px]">
          <Button
            text="Return to Account Overview"
            isArrow={false}
            href={"/account"}
          />
        </div>
      </div>
      <div className="w-full sm:grid-cols-1 py-6">
        <div>
          <h3>Order No. {order.name}</h3>
          <p className="mt-2">
            Placed on {new Date(order.processedAt!).toDateString()}
          </p>
          <div className="grid items-start gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full my-8 divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline ">
                  <th
                    scope="col"
                    className="pb-4 pl-0 pr-3 font-semibold text-left"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 pb-4 font-semibold text-right"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.lineItems.nodes.map((lineItem: any) => (
                  <tr key={lineItem.variant!.id}>
                    <td className="w-full py-4 pl-0 pr-3 align-top sm:align-middle max-w-0 sm:w-auto sm:max-w-none">
                      <div className="flex gap-6">
                        <Link
                          href={`/products/${
                            lineItem.variant!.product!.handle
                          }`}
                        >
                          {lineItem?.variant?.image && (
                            <div className="w-24 card-image aspect-square">
                              <Image
                                width={96}
                                height={96}
                                alt={
                                  lineItem.variant.image?.altText ??
                                  "Product image"
                                }
                                src={lineItem.variant.image?.src}
                                blurDataURL="URL"
                                placeholder="blur"
                              />
                            </div>
                          )}
                        </Link>
                        <div className="flex-col justify-center hidden lg:flex">
                          <p>{lineItem.title}</p>
                          <p className="mt-1">{lineItem.variant!.title}</p>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">Product</dt>
                          <dd className="lg:hidden">
                            <h5>{lineItem.title}</h5>
                            <p className="mt-1">{lineItem.variant!.title}</p>
                          </dd>
                          <dt className="sr-only">Price</dt>
                          <dd className="truncate sm:hidden">
                            <Price
                              className="mt-4"
                              amount={lineItem.variant!.price.amount}
                              currencyCode="USD"
                              currencyCodeClassName="hidden"
                            />
                          </dd>
                          <dt className="sr-only">Quantity</dt>
                          <dd className="truncate sm:hidden">
                            <p className="mt-1">Qty: {lineItem.quantity}</p>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <Price
                        amount={lineItem.variant!.price.amount}
                        currencyCode="USD"
                        currencyCodeClassName="hidden"
                      />
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <Price
                        amount={lineItem.discountedTotalPrice!.amount}
                        currencyCode="USD"
                        currencyCodeClassName="hidden"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <p>Subtotal</p>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 font-normal text-left sm:hidden"
                  >
                    <p>Subtotal</p>
                  </th>
                  <td className="pt-6 pl-3 pr-4 text-right md:pr-3">
                    <Price
                      amount={order.subtotalPriceV2!.amount}
                      currencyCode="USD"
                      currencyCodeClassName="hidden"
                    />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-normal text-left sm:hidden"
                  >
                    <p>Tax</p>
                  </th>
                  <td className="pt-4 pl-3 pr-4 text-right md:pr-3">
                    <Price
                      amount={order.totalTaxV2!.amount}
                      currencyCode="USD"
                      currencyCodeClassName="hidden"
                    />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-semibold text-right sm:table-cell md:pl-0"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-semibold text-left sm:hidden"
                  >
                    <p>Total</p>
                  </th>
                  <td className="pt-4 pl-3 pr-4 font-semibold text-right md:pr-3">
                    <Price
                      amount={order.totalPriceV2!.amount}
                      currencyCode="USD"
                      currencyCodeClassName="hidden"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="sticky border-none top-nav md:my-8">
              <h3 className="font-semibold">Shipping Address</h3>
              {order?.shippingAddress ? (
                <ul className="mt-6">
                  <li>
                    <p>
                      {order.shippingAddress.firstName &&
                        order.shippingAddress.firstName + " "}
                      {order.shippingAddress.lastName}
                    </p>
                  </li>
                  {order?.shippingAddress?.formatted ? (
                    order.shippingAddress.formatted.map((line: string) => (
                      <li key={line}>
                        <p>{line}</p>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3">No shipping address defined</p>
              )}
              <h3 className="mt-8 font-semibold">Status</h3>
              <div
                className={`mt-3 px-3 py-1 text-xs font-medium rounded-full inline-block w-auto ${
                  order.fulfillmentStatus === "FULFILLED"
                    ? "bg-green/20 text-green-800"
                    : "bg-primary/20 text-primary/50"
                }`}
              >
                {statusMessage(order.fulfillmentStatus!)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
