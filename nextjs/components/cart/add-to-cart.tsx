"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import LoadingDots from "components/loading-dots";
import parseGid from "lib/shopify/parse-gid";
import { ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function AddToCart({
  variants,
  availableForSale,
  autoSelect = false,
  type = "default",
  selectedVariantIdProp = null,
  additionalEventOnClick = null,
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  autoSelect?: boolean;
  type?: "default" | "pdp";
  selectedVariantIdProp?: string | null;
  additionalEventOnClick?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const defaultVariantId =
    variants.length === 1 || autoSelect ? variants[0]?.id : undefined;
  const quantity = searchParams.get("qty") || "1";

  const variant = variants.find(
    (variant: ProductVariant) =>
      variant.selectedOptions?.every(
        (option) => option.value === searchParams.get(option.name.toLowerCase())
      )
  );

  let selectedVariantId =
    selectedVariantIdProp || variant?.id || defaultVariantId;

  const title = !availableForSale
    ? "Out of stock"
    : !selectedVariantId
    ? "Please select options"
    : undefined;

  return (
    <>
      {type === "default" && (
        <button
          aria-label="Add item to cart"
          disabled={isPending || !availableForSale || !selectedVariantId}
          title={title}
          onClick={() => {
            if (!availableForSale || !selectedVariantId) return;

            startTransition(async () => {
              if (
                !selectedVariantId
                  ?.toString()
                  ?.includes("gid://shopify/ProductVariant/")
              )
                selectedVariantId =
                  "gid://shopify/ProductVariant/" + selectedVariantId;
              const error = await addItem(selectedVariantId, 1);

              if (error) {
                // Trigger the error boundary in the root error.js
                throw new Error(error.toString());
              }

              router.refresh();

              additionalEventOnClick && additionalEventOnClick();
            });
          }}
          className={clsx(
            `group/cart-button product-form__submit button relative z-10 inline-flex mt-[16px] items-center py-[11px] px-[16.33px] border-[0.9px] border-solid border-dark3 rounded-[323.9px] hover:bg-yellow disabled:bg-dark10 active:bg-yellow2 text-yellow hover:text-black active:text-black disabled:text-dark4 transition duration-200 w-full justify-center`,
            {
              "cursor-not-allowed opacity-60 hover:opacity-60":
                !availableForSale || !selectedVariantId,
              "cursor-not-allowed": isPending,
            }
          )}
        >
          {!isPending ? (
            <svg
              width={18}
              height={17}
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.3711 6.04627C13.919 5.54693 13.2374 5.25677 12.2927 5.15555V4.64271C12.2927 3.71824 11.9013 2.82752 11.2131 2.20671C10.518 1.57241 9.6138 1.2755 8.67584 1.36322C7.06309 1.51842 5.70676 3.07719 5.70676 4.76417V5.15555C4.76205 5.25677 4.08051 5.54693 3.6284 6.04627C2.97385 6.77505 2.9941 7.74674 3.06833 8.42154L3.54068 12.1801C3.68238 13.496 4.21547 14.8455 7.11707 14.8455H10.8824C13.784 14.8455 14.3171 13.496 14.4588 12.1869L14.9312 8.41479C15.0054 7.74674 15.0189 6.77505 14.3711 6.04627ZM8.77031 2.30118C9.4451 2.24045 10.0862 2.44963 10.5855 2.90174C11.0781 3.34711 11.3548 3.98141 11.3548 4.64271V5.11506H6.64472V4.76417C6.64472 3.56304 7.63666 2.40915 8.77031 2.30118ZM6.58399 8.87365H6.57724C6.2061 8.87365 5.90245 8.56999 5.90245 8.19885C5.90245 7.82772 6.2061 7.52406 6.57724 7.52406C6.95512 7.52406 7.25878 7.82772 7.25878 8.19885C7.25878 8.56999 6.95512 8.87365 6.58399 8.87365ZM11.3075 8.87365H11.3008C10.9296 8.87365 10.626 8.56999 10.626 8.19885C10.626 7.82772 10.9296 7.52406 11.3008 7.52406C11.6787 7.52406 11.9823 7.82772 11.9823 8.19885C11.9823 8.56999 11.6787 8.87365 11.3075 8.87365Z"
                className="group-hover/cart-button:fill-black fill-yellow group-disabled/cart-button:fill-dark4 group-active/cart-button:fill-black"
              />
            </svg>
          ) : (
            <LoadingDots className="bg-dark4" />
          )}
          <span className="font-inter text-[12px] lg:text-[14px] font-semibold leading-[15.4px] tracking-[-0.56px] ml-[8px]">
            {availableForSale ? "Add To Cart" : "Sold Out"}
          </span>
        </button>
      )}

      {type === "pdp" && (
        <>
          <button
            type="submit"
            name="add"
            className="btn-add-to-cart group/product-add-cart product-form__submit button p-[14px] border-[1px] border-solid border-dark4 disabled:border-dark3 rounded-[360px] hover:bg-green hover:border-transparent disabled:cursor-default disabled:pointer-events-none transition-all duration-200"
            disabled={
              isPending ||
              !variant?.availableForSale ||
              !availableForSale ||
              !selectedVariantId
            }
            title={title}
            onClick={() => {
              if (!availableForSale || !selectedVariantId) return;

              startTransition(async () => {
                if (
                  !selectedVariantId
                    ?.toString()
                    ?.includes("gid://shopify/ProductVariant/")
                )
                  selectedVariantId =
                    "gid://shopify/ProductVariant/" + selectedVariantId;
                const error = await addItem(
                  selectedVariantId,
                  Number(quantity)
                );

                if (error) {
                  // Trigger the error boundary in the root error.js
                  throw new Error(error.toString());
                }

                router.refresh();
              });
            }}
          >
            {!isPending ? (
              <svg
                className="cart-icon"
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.83562 1.50022C10.796 1.50022 12.4155 2.99397 12.6152 4.90441L12.6709 4.90507C13.7584 4.90507 15.0806 5.62732 15.5269 7.65307L16.1186 12.2333C16.3309 13.7116 16.0654 14.8973 15.3281 15.7478C14.5946 16.5938 13.4336 17.0416 11.9704 17.0416H5.7094C4.10215 17.0416 2.9824 16.6478 2.28565 15.8386C1.5859 15.0271 1.3519 13.8098 1.5904 12.2213L2.1724 7.70182C2.5549 5.62957 3.95365 4.90507 5.03665 4.90507C5.13014 4.04293 5.51889 3.22275 6.13562 2.60797C6.84437 1.90372 7.82162 1.50022 8.81987 1.50022H8.83562ZM12.6709 6.03007H5.03665C4.7059 6.03007 3.6004 6.16357 3.28315 7.87657L2.70415 12.3766C2.5159 13.6388 2.6614 14.5523 3.13765 15.1051C3.6079 15.6511 4.4494 15.9166 5.7094 15.9166H11.9704C12.7564 15.9166 13.8296 15.7598 14.4776 15.0113C14.9921 14.4181 15.1691 13.5346 15.0041 12.3848L14.4199 7.84582C14.1709 6.72757 13.5139 6.03007 12.6709 6.03007ZM11.023 8.11814C11.3335 8.11814 11.6027 8.37014 11.6027 8.68064C11.6027 8.99114 11.368 9.24314 11.0575 9.24314H11.023C10.7125 9.24314 10.4605 8.99114 10.4605 8.68064C10.4605 8.37014 10.7125 8.11814 11.023 8.11814ZM6.65042 8.11814C6.96092 8.11814 7.23017 8.37014 7.23017 8.68064C7.23017 8.99114 6.99467 9.24314 6.68417 9.24314H6.65042C6.33992 9.24314 6.08792 8.99114 6.08792 8.68064C6.08792 8.37014 6.33992 8.11814 6.65042 8.11814ZM8.83337 2.62522H8.82212C8.11637 2.62522 7.42862 2.90947 6.92987 3.40522C6.5236 3.80967 6.25789 4.34137 6.17193 4.90472L11.4814 4.90493C11.2887 3.61625 10.1743 2.62522 8.83337 2.62522Z"
                  className="fill-dark4 group-disabled/product-add-cart:fill-dark3 group-hover/product-add-cart:fill-black"
                />
              </svg>
            ) : (
              <svg
                className="loading-overlay__spinner h-5 w-5 animate-spin text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="{12}"
                  cy="{12}"
                  r="{10}"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </button>
          <form
            id="checkout-button"
            action={`${process.env.NEXT_PUBLIC_STORE_URL}/cart/${parseGid(
              selectedVariantId || ""
            )?.id}:${quantity}`}
          >
            <input
              disabled={
                isPending ||
                !variant?.availableForSale ||
                !availableForSale ||
                !selectedVariantId
              }
              className="btn-checkout cursor-pointer disabled:cursor-default disabled:pointer-events-none py-[17px] px-[107px] max-w-[290px] hover:text-black active:text-black disabled:text-dark4 bg-yellow active:bg-yellow2 disabled:bg-dark10 rounded-[360px] font-inter font-[700] text-[14px] leading-[14px] tracking-[-0.28px] text-black hover:opacity-75 active:opacity-100 transition-all duration-200"
              type="submit"
              value="Buy It Now!"
            />
          </form>
        </>
      )}
    </>
  );
}
