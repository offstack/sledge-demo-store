import {Link} from '~/components';
import type {CustomerDetailsFragment} from 'storefrontapi.generated';

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const {firstName, lastName, email, phone} = customer;

  return (
    <>
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 grid w-full gap-4 py-6 md:gap-8">
        <h3 className="text-xl lg:text-[48px] font-bold leading-[52.8px]">
          Account Details
        </h3>
        <div className="lg:p-8 p-6 border border-dark3 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1">Profile & Security</h3>
            <Link
              prefetch="intent"
              className="underline text-sm font-normal"
              to="/account/edit"
            >
              Edit
            </Link>
          </div>
          <div className="mt-4 text-sm text-primary/50">Name</div>
          <p className="mt-1 text-dark4">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') +
                (lastName ? lastName + ' ' : '')
              : 'Add name'}{' '}
          </p>

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          <p className="mt-1 text-dark4">{phone ?? 'Add mobile'}</p>

          <div className="mt-4 text-sm text-primary/50">Email address</div>
          <p className="mt-1 text-dark4">{email}</p>

          <div className="mt-4 text-sm text-primary/50">Password</div>
          <p className="mt-1 text-dark4">**************</p>
        </div>
      </div>
    </>
  );
}
