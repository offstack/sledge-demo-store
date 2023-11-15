"use client";

import { Button } from "components/global";
import { getInputStyleClasses } from "lib/utils";
import { FormEvent, useState } from "react";
import { addAddress, editAddress } from "./action";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Color: string;
  DateTime: string;
  Decimal: string;
  HTML: string;
  JSON: unknown;
  URL: string;
  UnsignedInt64: string;
};

export type MailingAddressInput = {
  /**
   * The first line of the address. Typically the street address or PO Box number.
   *
   */
  address1?: InputMaybe<Scalars["String"]>;
  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   *
   */
  address2?: InputMaybe<Scalars["String"]>;
  /**
   * The name of the city, district, village, or town.
   *
   */
  city?: InputMaybe<Scalars["String"]>;
  /**
   * The name of the customer's company or organization.
   *
   */
  company?: InputMaybe<Scalars["String"]>;
  /** The name of the country. */
  country?: InputMaybe<Scalars["String"]>;
  /** The first name of the customer. */
  firstName?: InputMaybe<Scalars["String"]>;
  /** The last name of the customer. */
  lastName?: InputMaybe<Scalars["String"]>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone?: InputMaybe<Scalars["String"]>;
  /** The region of the address, such as the province, state, or district. */
  province?: InputMaybe<Scalars["String"]>;
  /** The zip or postal code of the address. */
  zip?: InputMaybe<Scalars["String"]>;
};

export default function AddForm({
  address,
  addressId,
  defaultAddress,
  customerAccessToken,
  id,
}: {
  address: any;
  addressId: any;
  defaultAddress: any;
  customerAccessToken: any;
  id?: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const address: MailingAddressInput = {};

    const keys: (keyof MailingAddressInput)[] = [
      "lastName",
      "firstName",
      "address1",
      "address2",
      "city",
      "province",
      "country",
      "zip",
      "phone",
      "company",
    ];

    for (const key of keys) {
      const value = formData.get(key);
      if (typeof value === "string") {
        address[key] = value;
      }
    }

    if (addressId === "add") {
      try {
        setIsLoading(true);
        const { customerAddressCreate } = await addAddress({
          customerAccessToken,
          address,
        });
        if (!customerAddressCreate.customerAddress) {
          setError(customerAddressCreate.customerUserErrors[0].message);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        await editAddress({
          customerAccessToken,
          address,
          id,
        });
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  }
  return (
    <form method="post" onSubmit={submitHandler}>
      <input type="hidden" name="addressId" value={address?.id ?? addressId} />
      {error && (
        <div className="flex items-center justify-center mb-6 bg-dark2 rounded-md">
          <p className="m-4 text-s text-red">{error}</p>
        </div>
      )}
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="firstName"
          name="firstName"
          required
          type="text"
          autoComplete="given-name"
          placeholder="First name"
          aria-label="First name"
          defaultValue={address?.firstName ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="lastName"
          name="lastName"
          required
          type="text"
          autoComplete="family-name"
          placeholder="Last name"
          aria-label="Last name"
          defaultValue={address?.lastName ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Company"
          aria-label="Company"
          defaultValue={address?.company ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="address1"
          name="address1"
          type="text"
          autoComplete="address-line1"
          placeholder="Address line 1*"
          required
          aria-label="Address line 1"
          defaultValue={address?.address1 ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="address2"
          name="address2"
          type="text"
          autoComplete="address-line2"
          placeholder="Address line 2"
          aria-label="Address line 2"
          defaultValue={address?.address2 ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="city"
          name="city"
          type="text"
          required
          autoComplete="address-level2"
          placeholder="City"
          aria-label="City"
          defaultValue={address?.city ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="province"
          name="province"
          type="text"
          autoComplete="address-level1"
          placeholder="State / Province"
          required
          aria-label="State"
          defaultValue={address?.province ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="zip"
          name="zip"
          type="text"
          autoComplete="postal-code"
          placeholder="Zip / Postal Code"
          required
          aria-label="Zip"
          defaultValue={address?.zip ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="country"
          name="country"
          type="text"
          autoComplete="country-name"
          placeholder="Country"
          required
          aria-label="Country"
          defaultValue={address?.country ?? ""}
        />
      </div>
      <div className="mt-3">
        <input
          className={getInputStyleClasses()}
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Phone"
          aria-label="Phone"
          defaultValue={address?.phone ?? ""}
        />
      </div>
      <div className="mt-4">
        <input
          type="checkbox"
          name="defaultAddress"
          id="defaultAddress"
          defaultChecked={defaultAddress?.id === address?.id}
          className="custom-checkbox form-checkbox bg-transparent checked:bg-green h-[20px] w-[20px] text-green rounded-[4px] cursor-pointer focus:ring-green checked:bg-[url('/images/check.png')] checked:[background-size:14px]"
        />
        <label
          className="inline-block ml-2 text-sm cursor-pointer"
          htmlFor="defaultAddress"
        >
          Set as default address
        </label>
      </div>
      <div className="flex flex-wrap gap-3 items-center mt-5">
        <div>
          <Button
            text="Save"
            loading={isLoading}
            isArrow={false}
            type={"submit"}
          />
        </div>
        <div>
          <Button text="Cancel" href=".." isArrow={false} />
        </div>
      </div>
    </form>
  );
}
