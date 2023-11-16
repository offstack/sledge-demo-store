"use client";

import { Button, Link } from "components/global";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import type { Cart } from "lib/shopify/types";
import { useOutsideClick } from "lib/useOutsideClick";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DeleteItemButton from "./delete-item-button";
import EditItemQuantityButton from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({
  cart,
  type,
}: {
  cart: Cart | undefined;
  type: "mobile" | "desktop";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const ref: any = useRef();
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart?.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  useOutsideClick(ref, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <>
      <button
        className={`${type === "desktop" ? "hidden lg:block" : ""}`}
        onClick={openCart}
      >
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <div
        className={`${
          isOpen ? "visible" : "invisible"
        } absolute z-50 cart-drawer`}
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-dark2 bg-opacity-50 transition-opacity" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={ref}
              className={`pointer-events-none fixed inset-y-0 flex max-w-full transform duration-300 ${
                isOpen ? "right-0" : "right-[-999px]"
              }`}
            >
              <div className="pointer-events-auto w-screen md:max-w-[387px]">
                <div className="flex h-full flex-col overflow-hidden bg-dark5">
                  <div className="flex-1 px-[20px] py-8 pb-[12px]">
                    <div className="flex items-start justify-between px-3">
                      <h4
                        className="text-white text-lg font-bold lg:text-[24px] leading-[28.8px]"
                        id="slide-over-title"
                      >
                        My Cart
                      </h4>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          aria-label="Close cart"
                          onClick={closeCart}
                          className="drawer__close -m-2 bg-dark p-1 rounded-xl"
                        >
                          <span className="sr-only">Close panel</span>
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.13398 19.3248L6.08398 18.2748L11.859 12.4998L6.08398 6.7248L7.13398 5.6748L12.909 11.4498L18.684 5.6748L19.734 6.7248L13.959 12.4998L19.734 18.2748L18.684 19.3248L12.909 13.5498L7.13398 19.3248Z"
                              fill="#9C9C9C"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flow-root pt-[28px]">
                      <ul
                        role="list"
                        className={`divide-y divide-dark8 drawer__cart-items-wrapper overflow-y-scroll px-3 ${
                          !cart || cart.lines.length === 0
                            ? "max-h-full"
                            : "max-h-[350px]"
                        }`}
                      >
                        {!cart || cart.lines.length === 0 ? (
                          <div className="flex flex-col space-y-7 justify-center items-center h-screen">
                            <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
                              Your cart is empty
                            </h2>
                            <div className="flex items-center text-white justify-center gap-x-6 lg:justify-start hover:opacity-70 transition duration-200 mt-[8px] lg:mt-[12px] mb-4">
                              <Button
                                isArrow
                                text="Continue shopping"
                                href="/collections/all"
                                onClick={() => setIsOpen(false)}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            {cart.lines.map((item, i) => {
                              const merchandiseSearchParams =
                                {} as MerchandiseSearchParams;

                              item.merchandise.selectedOptions.forEach(
                                ({ name, value }) => {
                                  if (value !== DEFAULT_OPTION) {
                                    merchandiseSearchParams[
                                      name.toLowerCase()
                                    ] = value;
                                  }
                                }
                              );

                              return (
                                <li
                                  key={i}
                                  className="flex py-[24.86px] cart-item"
                                >
                                  <div className="relative">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[8px] bg-dark2">
                                      <Image
                                        className="h-full w-full object-cover"
                                        width={64}
                                        height={64}
                                        alt={
                                          item.merchandise.image.altText ||
                                          item.merchandise.product.title
                                        }
                                        src={item.merchandise.image.url}
                                        blurDataURL="URL"
                                        placeholder="blur"
                                      />
                                    </div>
                                    <div className="flex absolute top-[-13px] left-[-12.5px]">
                                      <DeleteItemButton
                                        item={item}
                                        type={"modal"}
                                      />
                                    </div>
                                  </div>
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h5 className="text-[16px] leading-[19.2px] font-bold">
                                          <Link
                                            className="text-white product-title"
                                            href={`/product/${item.merchandise.product.handle}`}
                                            onClick={() => setIsOpen(false)}
                                          >
                                            {item.merchandise.product.title}
                                          </Link>
                                        </h5>
                                        <Price
                                          className="ml-4 text-white font-inter text-[16px] font-bold leading-[19.2px]"
                                          amount={item.cost.totalAmount.amount}
                                          currencyCode={"USD"}
                                          currencyCodeClassName="hidden"
                                        />
                                      </div>
                                      <div className="flex justify-between items-center pt-[8.4px]">
                                        {!item.merchandise.selectedOptions
                                          .length ? null : (
                                          <p className="flex gap-[10px] font-inter font-medium text-dark4 text-[10.8px] leading-[17.27px] tracking-[-0.216px] pl-[9px]">
                                            {item.merchandise.selectedOptions.map(
                                              (option: any, index: number) => {
                                                return (
                                                  <span
                                                    key={index}
                                                    className="flex gap-[3px]"
                                                  >
                                                    <span>
                                                      {option.name + ":"}
                                                    </span>
                                                    <span>{option.value}</span>
                                                  </span>
                                                );
                                              }
                                            )}
                                          </p>
                                        )}
                                        <div className="flex items-center rounded-[8px] py-[2px] px-[2.5px] border border-dark6">
                                          <EditItemQuantityButton
                                            item={item}
                                            type="minus"
                                          />
                                          <input
                                            type="number"
                                            className="bg-transparent font-inter !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none focus:border-none focus:box-shadow-none pointer-events-none cursor-not-allowed"
                                            value={item.quantity}
                                          />
                                          <EditItemQuantityButton
                                            item={item}
                                            type="plus"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {!cart || cart.lines.length === 0 ? null : (
                    <>
                      <div className="px-8">
                        <div className="pb-[40.11px] divide-y divide-dark8">
                          <div className="flex justify-between py-[24.13px]">
                            <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
                              Taxes
                            </p>
                            <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
                              Calculated at checkout
                            </p>
                          </div>
                          <div className="flex justify-between py-[24.13px]">
                            <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
                              Shipping
                            </p>
                            <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
                              Calculated at checkout
                            </p>
                          </div>
                          <div className="flex justify-between pt-[24.13px]">
                            <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
                              Total
                            </p>
                            <Price
                              className="font-inter text-[16px] leading-[19.2px] text-white font-bold"
                              amount={cart?.cost.subtotalAmount.amount}
                              currencyCode={"USD"}
                              currencyCodeClassName="hidden"
                            />
                          </div>
                        </div>
                        <div>
                          <Link
                            href={"/cart"}
                            className="block font-inter bg-dark9 text-[16px] font-semibold leading-[17.6px] tracking-[-0.32px] text-center text-white mb-[12px] py-[16px] px-[24px] rounded-[360px] transition-all duration-200 hover:opacity-75"
                            onClick={() => setIsOpen(false)}
                          >
                            <span>
                              View My Cart{" "}
                              {!cart?.lines?.length
                                ? null
                                : "(" + cart?.totalQuantity + ")"}
                            </span>
                          </Link>
                          <a
                            href={cart?.checkoutUrl}
                            className="cart__checkout-button text-[16px] font-inter font-semibold leading-[17.6px] tracking-[-0.32px] text-black button w-full block text-center py-[16px] px-[24px] bg-yellow rounded-[360px] transition-all duration-200 hover:opacity-75"
                          >
                            <span>Checkout</span>
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
