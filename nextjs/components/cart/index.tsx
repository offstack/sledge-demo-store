import { getCart } from "lib/shopify";
import { cookies } from "next/headers";
import CartModal from "./modal";

export default async function Cart({ type }: { type: "mobile" | "desktop" }) {
  const cartId = cookies().get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartModal type={type} cart={cart} />;
}
