"use client";

import { Rating } from "@sledge-app/react-product-review";
import { Button, Link } from "components/global";
import Price from "components/price";
import { useState } from "react";
import DeleteItemButton from "./delete-item-button";
import EditItemQuantityButton from "./edit-item-quantity-button";

export function CartComponents({ cart }: any) {
  const linesCount = Boolean(cart?.totalQuantity || 0);
  return <>{!linesCount ? <CartEmpty /> : <CartDetails cart={cart} />}</>;
}

export function CartDetails({ cart }: any) {
  const { cost } = cart;
  const [removedItems, setRemovedItems]: any = useState([]);
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-[32px] leading-[35.2px] lg:text-[48px] font-bold lg:leading-[52.8px]">
          Your Cart
        </h2>
        <div className="lg:w-fit flex items-center text-white justify-center gap-x-6 lg:justify-start hover:opacity-70 transition duration-200 mt-0 !w-fit">
          <Button
            text="Continue shopping"
            isArrow={true}
            iconClass="ml-[8px]"
            href={"/collections/all"}
          />
        </div>
      </div>
      <DeleteItemButton
        removedItems={removedItems}
        setRemovedItems={setRemovedItems}
        item={removedItems}
        type={"multipleRemove"}
      />
      <div className="mt-8">
        <div className="hidden sm:flex min-w-full py-2 align-middle gap-[40px] flex-col overflow-x-auto pt-7">
          <CartTable
            lines={cart.lines}
            removedItems={removedItems}
            setRemovedItems={setRemovedItems}
          />
        </div>
        <div className="sm:hidden flex overflow-x-hidden min-w-full py-2 align-middle gap-[25px] flex-col pt-7">
          <CartLineMobile
            lines={cart.lines}
            removedItems={removedItems}
            setRemovedItems={setRemovedItems}
          />
        </div>
      </div>
      <div className="flex lg:justify-end">
        <div className="flex flex-col gap-[16px] w-full lg:w-[330px]">
          <CartSummary cost={cost} />
          <CartActions checkoutUrl={cart.checkoutUrl} />
        </div>
      </div>
    </>
  );
}

export function CartEmpty() {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:px-12 px-4 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Button
        text="Continue shopping"
        isArrow
        iconClass="ml-[8px]"
        href={"/collections/all"}
      />
    </div>
  );
}

export function CartTable({ lines, removedItems, setRemovedItems }: any) {
  return (
    <table className="min-w-full divide-y divide-dark6">
      <thead>
        <tr>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pb-[10px]"
          ></th>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pb-[10px] pl-[15px]"
          >
            Product
          </th>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pl-[20px] pb-[10px]"
          >
            Quantity
          </th>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pb-[10px]"
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-dark6 bg-dark">
        {lines.map((lineItem: any, index: any) => {
          const { merchandise, quantity } = lineItem;
          return (
            <tr key={index}>
              <td className="whitespace-nowrap">
                <div className="flex items-center lg:pl-[4px]">
                  <input
                    id={`cart-${merchandise.id}`}
                    type="checkbox"
                    className="custom-checkbox form-checkbox bg-transparent checked:bg-green h-[20px] w-[20px] text-green rounded-[4px] cursor-pointer focus:ring-green checked:bg-[url('/images/check.png')] checked:[background-size:14px]"
                    name={merchandise.id}
                    value={lineItem.id}
                    autoComplete="off"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRemovedItems([...removedItems, lineItem.id]);
                      } else {
                        setRemovedItems(
                          removedItems.filter(
                            (item: any) => item !== lineItem.id
                          )
                        );
                      }
                    }}
                  />
                </div>
              </td>
              <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div className="flex items-center gap-[32px]">
                  <Link
                    href={"/product/" + merchandise.product.handle}
                    className="flex-shrink-0 flex justify-center items-center mr-[15px] md:mr-[32px] bg-sledge-color-grey-4 rounded-[24px] hover:opacity-75"
                  >
                    <img
                      src={merchandise.product.images?.edges[0].node.url}
                      alt="Product Image"
                      width={merchandise.product.images?.edges[0].node.width}
                      height={merchandise.product.images?.edges[0].node.height}
                      className="w-[90px] h-[90px] min-w-[90px] min-h-[90px] lg:w-[120px] lg:h-[120px] object-cover object-center"
                    />
                  </Link>
                  <div>
                    <h5 className="font-bold text-[20px] leading-[24px] text-white product-title">
                      {merchandise.product.title}
                    </h5>
                    <p className="text-dark4 text-[14px] leading-[22.4px] tracking-[-0.28px] mt-[12px] mb-[7px]">
                      Vendor: {merchandise.product.vendor} | SKU:{" "}
                      {merchandise.sku}{" "}
                    </p>
                    <Rating
                      params={{
                        productId: merchandise.product.id,
                      }}
                      size="xs"
                    />
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap min-w-[120px] lg:min-w-fit">
                <div className="w-fit">
                  <label htmlFor="Quantity" className="sr-only">
                    Quantity
                  </label>
                  <div className="flex items-center border border-dark6 rounded-[8px] py-[4px] px-[8px]">
                    <EditItemQuantityButton item={lineItem} type="minus" />
                    <input
                      type="number"
                      id="Quantity"
                      defaultValue={lineItem.quantity}
                      value={lineItem.quantity}
                      className="quantity__input bg-transparent font-inter text-white !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none focus:border-none focus:box-shadow-none cursor-not-allowed"
                      disabled
                    />
                    <EditItemQuantityButton item={lineItem} type="plus" />
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap min-w-[120px] lg:min-w-fit">
                <span className="font-sledge-font-family-2 text-[28px] md:text-[32px] leading-[38px] text-sledge-color-text-primary">
                  <strong>
                    <Price
                      amount={lineItem.cost.totalAmount.amount}
                      currencyCode="USD"
                      currencyCodeClassName="hidden"
                    />
                  </strong>
                </span>
              </td>
              <td className="whitespace-nowrap min-w-[60px] lg:min-w-fit">
                <DeleteItemButton item={lineItem} type={"cartPage"} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function CartLineMobile({ lines, removedItems, setRemovedItems }: any) {
  return (
    <>
      {lines.map((lineItem: any, index: any) => {
        const { merchandise, quantity } = lineItem;
        return (
          <>
            <div className="flex gap-[16px]">
              <div className="flex gap-[16px] min-w-[116px]">
                <input
                  id={`cart-${merchandise.id}`}
                  type="checkbox"
                  className="custom-checkbox ml-[4px] mt-[34px] form-checkbox bg-transparent checked:bg-green h-[20px] w-[20px] text-green rounded-[4px] cursor-pointer focus:ring-green checked:bg-[url('/images/check.png')] checked:[background-size:14px]"
                  name={merchandise.id}
                  value={lineItem.id}
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRemovedItems([...removedItems, lineItem.id]);
                    } else {
                      setRemovedItems(
                        removedItems.filter((item: any) => item !== lineItem.id)
                      );
                    }
                  }}
                />
                <Link
                  href={"/product/" + merchandise.product.handle}
                  className="flex-shrink-0 flex h-fit justify-center items-center mr-[15px] md:mr-[32px] bg-sledge-color-grey-4 rounded-[24px] hover:opacity-75"
                >
                  <img
                    src={merchandise.product.images?.edges[0].node.url}
                    alt="Product Image"
                    width={merchandise.product.images?.edges[0].node.width}
                    height={merchandise.product.images?.edges[0].node.height}
                    className="w-[80px] h-[80px] object-cover object-center"
                  />
                </Link>
              </div>
              <div className="flex flex-col w-full">
                <div>
                  <h5 className="font-bold text-[18px] leading-[21.6px] text-white product-title">
                    {merchandise.product.title}
                  </h5>
                  <p className="text-dark4 text-[12px] leading-[19.2px] tracking-[-0.24px] mt-[8px] mb-[4px]">
                    Vendor: {merchandise.product.vendor} | SKU:{" "}
                    {merchandise.sku}{" "}
                  </p>
                  <Rating
                    params={{
                      productId: merchandise.product.id,
                    }}
                    size="xs"
                  />
                </div>
                <div className="flex w-full items-center mt-[14px]">
                  <span className="text-[24px] leading-[28.8px] font-[500] font-inter">
                    <strong>
                      <Price
                        amount={lineItem.cost.totalAmount.amount}
                        currencyCode="USD"
                        currencyCodeClassName="hidden"
                      />
                    </strong>
                  </span>
                  <div className="flex gap-[16px] items-center ml-auto">
                    <div className="w-fit">
                      <label htmlFor="Quantity" className="sr-only">
                        Quantity
                      </label>
                      <div className="flex items-center border border-dark6 rounded-[8px] py-[7px] px-[8px]">
                        <EditItemQuantityButton item={lineItem} type="minus" />
                        <input
                          type="number"
                          id="Quantity"
                          defaultValue={lineItem.quantity}
                          value={lineItem.quantity}
                          className="quantity__input bg-transparent font-inter text-white !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none focus:border-none focus:box-shadow-none cursor-not-allowed"
                          disabled
                        />
                        <EditItemQuantityButton item={lineItem} type="plus" />
                      </div>
                    </div>
                    <DeleteItemButton item={lineItem} type={"cartPage"} />
                  </div>
                </div>
              </div>
            </div>
            <hr className="h-[0.332px] border-dark6" />
          </>
        );
      })}
    </>
  );
}

export function CartSummary({ cost }: any) {
  return (
    <>
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
            amount={cost?.subtotalAmount?.amount}
            currencyCode="USD"
            currencyCodeClassName="hidden"
            className={
              "font-inter text-[16px] leading-[19.2px] text-white font-bold"
            }
          />
        </div>
      </div>
    </>
  );
}

export function CartActions({ checkoutUrl }: any) {
  if (!checkoutUrl) return null;
  return (
    <div className="flex flex-col">
      <Link
        href={checkoutUrl}
        className="cart__checkout-button text-[16px] font-inter font-semibold leading-[17.6px] tracking-[-0.32px] text-black button w-full block text-center py-[16px] px-[24px] bg-yellow rounded-[360px] transition-all duration-200 hover:opacity-75"
      >
        Buy Now
      </Link>
    </div>
  );
}
