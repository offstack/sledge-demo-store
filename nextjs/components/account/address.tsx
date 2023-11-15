"use client";

import { Link } from "components/global";
import { FormEvent } from "react";
import { deleteAddress } from "./action";

export default function Address({
  address,
  defaultAddress,
  customerAccessToken,
}: {
  address: any;
  defaultAddress?: any;
  customerAccessToken?: any;
}) {
  async function removeAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = formData.get("addressId");
    await deleteAddress({ customerAccessToken, id });
  }
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
            {"" +
              (address.firstName && address.firstName + " ") +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="flex flex-row font-medium mt-6 items-baseline">
        <Link
          href={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-left underline text-sm"
        >
          Edit
        </Link>
        <form method="delete" onSubmit={removeAddress}>
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-left text-primary/50 ml-6 text-sm">
            Remove
          </button>
        </form>
      </div>
    </div>
  );
}
