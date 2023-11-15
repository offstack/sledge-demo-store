import { CartComponents } from "components/cart/cart-components";
import { getCart } from "lib/shopify";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function Page() {
  const cartId = cookies().get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 mt-[10px] lg:mt-[40.5px]">
      <Suspense>
        <CartComponents cart={cart} />
      </Suspense>
    </div>
  );
}
