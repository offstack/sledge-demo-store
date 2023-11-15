import {Form} from '@remix-run/react';
import {Button, Link} from '~/components';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import type {CustomerDetailsFragment} from 'storefrontapi.generated';

export function AccountAddressBook({
  customer,
  addresses,
}: {
  customer: CustomerDetailsFragment;
  addresses: MailingAddress[];
}) {
  return (
    <>
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 grid w-full gap-4 py-6 md:gap-3">
        <h3 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
          Address Book
        </h3>
        <div>
          {!addresses?.length && (
            <p className="mb-1 text-dark4">
              You haven't saved any addresses yet.
            </p>
          )}
          <div className="my-[25px] pb-[20px]">
            <Button text="Add an Address" isArrow={false} to={'address/add'} />
          </div>
          {Boolean(addresses?.length) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {customer.defaultAddress && (
                <Address address={customer.defaultAddress} defaultAddress />
              )}
              {addresses
                .filter((address) => address.id !== customer.defaultAddress?.id)
                .map((address) => (
                  <Address key={address.id} address={address} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
}: {
  address: MailingAddress;
  defaultAddress?: boolean;
}) {
  return (
    <div className="lg:p-8 p-6 border border-dark3 rounded flex flex-col">
      {defaultAddress && (
        <div className="mb-3 flex flex-row">
          <span className="py-1 text-xs font-medium rounded-full bg-primary/20 text-primary/50">
            Default
          </span>
        </div>
      )}
      <ul className="flex-1 flex-row">
        {(address.firstName || address.lastName) && (
          <li>
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="flex flex-row font-medium mt-6 items-baseline">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-left underline text-sm"
          prefetch="intent"
        >
          Edit
        </Link>
        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-left text-primary/50 ml-6 text-sm">
            Remove
          </button>
        </Form>
      </div>
    </div>
  );
}
