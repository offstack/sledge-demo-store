"use server";

import {
  createAddress,
  doLogin,
  doLogout,
  doRegister,
  recoverAddres,
  removeAddress,
  updateAddress,
} from "lib/shopify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async ({ email, password }: any) => {
  let login: any;
  let accesToken: string;
  let expiresAt: any;
  login = await doLogin(email, password);

  if (
    login &&
    !login.data.customerAccessTokenCreate.customerUserErrors.length
  ) {
    accesToken =
      login.data.customerAccessTokenCreate.customerAccessToken?.accessToken;
    expiresAt =
      login.data.customerAccessTokenCreate.customerAccessToken?.expiresAt;

    cookies().set("session", accesToken);
    return redirect("/account");
  }

  return login.data;
};

export const logout = async () => {
  let logout;
  logout = await doLogout();
  if (logout) {
    cookies().delete("session");
    return redirect("/");
  }
};

export const register = async ({
  email,
  password,
  firstName,
  lastName,
}: any) => {
  let register: any;

  register = await doRegister({
    input: { email, password, firstName, lastName },
  });

  if (register.data.customerCreate.customer) {
    await login({
      email,
      password,
    });
  }

  return register.data;
};

export const addAddress = async ({ customerAccessToken, address }: any) => {
  let addAddress: any;

  addAddress = await createAddress({ customerAccessToken, address });
  if (addAddress.data.customerAddressCreate.customerAddress) {
    return redirect("/account");
  }

  return addAddress.data;
};

export const deleteAddress = async ({ customerAccessToken, id }: any) => {
  let remove: any;

  remove = await removeAddress({ customerAccessToken, id });
  if (!remove.data.customerAddressDelete.customerUserErrors.length) {
    return redirect("/account");
  }

  return remove.data;
};

export const editAddress = async ({
  customerAccessToken,
  address,
  id,
}: any) => {
  let update: any;

  update = await updateAddress({ customerAccessToken, address, id });
  if (!update.data.customerAddressUpdate.customerUserErrors.length) {
    return redirect("/account");
  }

  return update.data;
};

export const recoveringAddress = async ({ email }: any) => {
  let recover: any;
  recover = await recoverAddres({ email });
  return recover.data;
};
