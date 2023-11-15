import AddForm from "components/account/addForm";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
  title: "Add Address",
};

export default async function Page() {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  const getSession: any = cookies().get("session")?.value;

  const defaultAddress: any = {};
  const addressId = pathname?.split("/")[3];
  const address = {};

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
      <h3 className="mt-4 mb-6">Add address</h3>
      <AddForm
        address={address}
        addressId={addressId}
        defaultAddress={defaultAddress}
        customerAccessToken={getSession}
      />
    </div>
  );
}
