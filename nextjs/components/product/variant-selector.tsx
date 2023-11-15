"use client";

import clsx from "clsx";
import { Link } from "components/global";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { createUrl } from "lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    // Adds key / value pairs for each variant (ie. "color": "Black" and "size": 'M").
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {}
    ),
  }));

  return options.map((option) => (
    <div className="mt-[24px]" key={option.id}>
      <div className="flex items-center justify-between">
        <h6 className="text-[18px] leading-[21.6px]">{option.name}</h6>
      </div>
      <div className="mt-[11.5px]">
        <legend className="sr-only">Choose a {option.name}</legend>
        <div className="flex flex-wrap gap-[16px]">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current params so we can preserve any other param state in the url.
            const optionSearchParams = new URLSearchParams(
              searchParams.toString()
            );

            // Update the option params using the current option to reflect how the url *would* change,
            // if the option was clicked.
            optionSearchParams.set(optionNameLowerCase, value);
            const optionUrl = createUrl(pathname, optionSearchParams);

            // In order to determine if an option is available for sale, we need to:
            //
            // 1. Filter out all other param state
            // 2. Filter out invalid options
            // 3. Check if the option combination is available for sale
            //
            // This is the "magic" that will cross check possible variant combinations and preemptively
            // disable combinations that are not available. For example, if the color gray is only available in size medium,
            // then all other sizes should be disabled.
            const filtered = Array.from(optionSearchParams.entries()).filter(
              ([key, value]) =>
                options.find(
                  (option) =>
                    option.name.toLowerCase() === key &&
                    option.values.includes(value)
                )
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale
              )
            );

            // The option is active if it's in the url params.
            const isActive = searchParams.get(optionNameLowerCase) === value;

            // You can't disable a link, so we need to render something that isn't clickable.
            const DynamicTag = isAvailableForSale ? Link : "p";
            const dynamicProps = {
              ...(isAvailableForSale && { scroll: false }),
            };

            if (
              optionNameLowerCase === "color" ||
              optionNameLowerCase === "colour"
            )
              return (
                <DynamicTag
                  style={{ background: value?.toString()?.toLocaleLowerCase() }}
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  href={optionUrl}
                  title={`${option.name} ${value}${
                    !isAvailableForSale ? " (Out of Stock)" : ""
                  }`}
                  className={clsx(
                    "block w-[30px] h-[30px] rounded-[360px] border-[1px] border-solid focus:outline-none cursor-pointer hover:opacity-75 mt-[2.8px]",
                    {
                      "border-green": isActive,
                      "border-gray-800": !isActive && isAvailableForSale,
                      "": !isAvailableForSale,
                    }
                  )}
                  {...dynamicProps}
                />
              );

            return (
              <div>
                <DynamicTag
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  href={optionUrl}
                  title={`${option.name} ${value}${
                    !isAvailableForSale ? " (Out of Stock)" : ""
                  }`}
                  className={clsx(
                    "font-inter max-h-[31.5px] flex items-center lg:text-[16px] leading-[25.6px] tracking-[-0.32px] bg-dark2 py-[6px] px-[14px] rounded-[360px] hover:opacity-75",
                    {
                      "text-black bg-green": isActive,
                      "text-dark4": !isActive && isAvailableForSale,
                      "text-dark4 !bg-dark2 cursor-not-allowed":
                        !isAvailableForSale,
                    }
                  )}
                  {...dynamicProps}
                >
                  {value}
                </DynamicTag>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ));
}
