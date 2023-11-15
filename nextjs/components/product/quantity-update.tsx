"use client";

import clsx from "clsx";
import { ProductVariant } from "lib/shopify/types";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function QuantityUpdater({
  variants,
}: {
  variants: ProductVariant[] & { quantityAvailable: any }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const defaultVariant = variants.length === 1 ? variants[0] : undefined;

  const optionSearchParams = new URLSearchParams(searchParams.toString());

  const variant = variants.find(
    (variant: ProductVariant) =>
      variant.selectedOptions?.every(
        (option) => option.value === searchParams.get(option.name.toLowerCase())
      )
  );

  const quantity = searchParams.get("qty") || "1";
  const quantityStock =
    variant?.quantityAvailable || defaultVariant?.quantityAvailable;

  const update = (type: "plus" | "minus") => {
    const quantity_: number = parseInt(quantity);
    let newQuantity = type === "plus" ? quantity_ + 1 : quantity_ - 1;
    if (newQuantity < 1 || newQuantity > (quantityStock || 1))
      newQuantity = parseInt(quantity);

    optionSearchParams.set("qty", newQuantity.toString());
    const optionUrl = createUrl(pathname, optionSearchParams);
    return optionUrl;
  };

  const router = useRouter();
  if (parseInt(quantity) > (quantityStock || 1)) {
    optionSearchParams.set("qty", quantityStock?.toString() || "1");
    router.push(createUrl(pathname, optionSearchParams), { scroll: false });
  }

  return (
    <>
      <div className="w-fit">
        <label htmlFor="quantity" className="sr-only">
          Quantity
        </label>
        <div className="flex items-center bg-dark2 rounded-[8px] py-[4px] px-[8px]">
          <Link
            scroll={false}
            className={clsx(
              "flex justify-center items-center text-dark4 w-[16px] h-[16px] transition hover:opacity-75",
              {
                "cursor-not-allowed": !quantityStock,
              }
            )}
            href={update("minus")}
          >
            -
          </Link>
          <input
            className="main-product h-[22px] quantity__input bg-dark2 font-sledge-font-family-3 text-white
              !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center 
              [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
              focus:border-none focus:box-shadow-none"
            value={quantity}
            disabled={!quantityStock}
          />
          <Link
            scroll={false}
            className={clsx(
              "flex justify-center items-center text-dark4 w-[16px] h-[16px] transition hover:opacity-75",
              {
                "cursor-not-allowed": !quantityStock,
              }
            )}
            href={update("plus")}
          >
            +
          </Link>
        </div>
      </div>
      {quantityStock && (
        <span className="font-inter text-dark4 font-medium text-[14px] leading-[22.4px] tracking-[-0.28px]">
          Stock: {quantityStock} pcs
        </span>
      )}
    </>
  );
}
