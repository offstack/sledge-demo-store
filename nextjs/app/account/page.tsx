import Address from "components/account/address";
import LogoutButton from "components/account/logoutButton";
import { Button, Link } from "components/global";
import { getCustomer } from "lib/shopify";
import { statusMessage } from "lib/utils";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Account",
};

export default async function Page() {
  const getSession: any = cookies().get("session")?.value;

  const { data }: any = await getCustomer(getSession);

  const { customer } = data;
  const orders = customer?.orders;
  const addresses = customer?.addresses;

  const heading = customer
    ? customer?.firstName
      ? `Welcome, ${customer?.firstName}`
      : `Welcome to your account.`
    : "Account Details";

  return (
    <>
      {getSession && (
        <>
          <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 mt-[40.5px]">
            <h1 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
              {heading}
            </h1>
            <LogoutButton />
          </div>
          <AccountOrderHistory orders={orders} />
          <AccountDetails customer={customer} />
          <AccountAddressBook
            customerAccessToken={getSession}
            addresses={addresses}
            customer={customer}
          />
        </>
      )}
    </>
  );
}

function AccountOrderHistory({ orders }: any) {
  return (
    <div className={`${orders?.edges.length ? "mt-6" : ""}`}>
      <div
        className={`max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 grid w-full gap-4 ${
          orders?.edges.length ? "md:gap-8" : "md:gap-5"
        } `}
      >
        {!orders?.edges.length ? null : (
          <h2 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
            Order History
          </h2>
        )}
        {orders?.edges.length ? (
          <Orders orders={orders.edges} />
        ) : (
          <EmptyOrders />
        )}
      </div>
    </div>
  );
}

function Orders({ orders }: any) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 false sm:grid-cols-3">
      {orders.map((order: any) => (
        <OrderCard order={order} key={order.node.id} />
      ))}
    </ul>
  );
}

function OrderCard({ order }: any) {
  const { orderNumber, lineItems, processedAt, fulfillmentStatus } = order.node;
  const { image } = lineItems.edges[0].node.variant;
  const [legacyOrderId, key] = order.node!.id!.split("/").pop()!.split("?");

  return (
    <li
      className="grid text-center border border-dark2 rounded"
      key={order.node!.id}
    >
      <Link
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        href={`/account/orders/${legacyOrderId}?${key}`}
      >
        {lineItems.edges[0].node.variant?.image && (
          <div className="card-image aspect-square bg-primary/5">
            <Image
              width={168}
              height={168}
              className="w-full fadeIn cover"
              alt={
                lineItems.edges[0].node.variant?.image?.altText ?? "Order image"
              }
              src={lineItems.edges[0].node.variant?.image.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems.edges[0].node.variant?.image && "md:col-span-2"
          }`}
        >
          <h5>
            {lineItems.length > 1
              ? `${lineItems.edges[0].node.title} +${lineItems.length - 1} more`
              : lineItems.edges[0].node.title}
          </h5>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <p>Order No. {orderNumber}</p>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <p>{new Date(processedAt).toDateString()}</p>
            </dd>
            <dt className="sr-only">Fulfillment Status</dt>
            <dd className="mt-2">
              <span
                className={`w-fit block px-3 py-1 text-xs font-medium rounded-full ${
                  fulfillmentStatus === "FULFILLED"
                    ? "bg-green/20 text-green-800"
                    : "bg-gray-500/50 text-white"
                }`}
              >
                <p>{statusMessage(fulfillmentStatus)}</p>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
      <div className="self-end border-t border-dark2">
        <Link
          className="block w-full p-2 text-center"
          href={`/account/orders/${legacyOrderId}?${key}`}
        >
          <p className="ml-3">View Details</p>
        </Link>
      </div>
    </li>
  );
}

function EmptyOrders() {
  return (
    <>
      <p className="text-dark4">You haven't placed any orders yet.</p>
      <Button
        text="Start Shopping"
        className="!w-fit"
        to={"/pages/search-result"}
      />
    </>
  );
}

function AccountDetails({ customer }: { customer: any }) {
  const { firstName, lastName, email, phone } = customer;

  return (
    <>
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 grid w-full gap-4 py-6 md:gap-8">
        <h3 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
          Account Details
        </h3>
        <div className="lg:p-8 p-6 border border-dark3 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1">Profile & Security</h3>
          </div>
          <div className="mt-4 text-sm text-primary/50">Name</div>
          <p className="mt-1 text-dark4">
            {firstName || lastName
              ? (firstName ? firstName + " " : "") +
                (lastName ? lastName + " " : "")
              : "Add name"}{" "}
          </p>

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          <p className="mt-1 text-dark4">{phone ?? "Add mobile"}</p>

          <div className="mt-4 text-sm text-primary/50">Email address</div>
          <p className="mt-1 text-dark4">{email}</p>

          <div className="mt-4 text-sm text-primary/50">Password</div>
          <p className="mt-1 text-dark4">**************</p>
        </div>
      </div>
    </>
  );
}

function AccountAddressBook({
  customer,
  addresses,
  customerAccessToken,
}: {
  customer: any;
  addresses: any;
  customerAccessToken?: any;
}) {
  return (
    <>
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 grid w-full gap-4 py-6 md:gap-3">
        <h3 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
          Address Book
        </h3>
        <div>
          {!addresses?.edges.length && (
            <p className="mb-1 text-dark4">
              You haven't saved any addresses yet.
            </p>
          )}
          <div className="my-[25px] pb-[20px]">
            <Button
              text="Add an Address"
              isArrow={false}
              href={"/account/address/add"}
            />
          </div>
          {Boolean(addresses?.edges.length) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {customer.defaultAddress && (
                <Address
                  customerAccessToken={customerAccessToken}
                  address={customer.defaultAddress}
                  defaultAddress
                />
              )}
              {addresses?.edges
                .filter(
                  (address: any) =>
                    address.node.id !== customer.defaultAddress?.id
                )
                .map((address: any) => (
                  <Address
                    customerAccessToken={customerAccessToken}
                    key={address.node.id}
                    address={address.node}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
