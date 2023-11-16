"use client";

import { Trigger } from "@sledge-app/react-wishlist";
import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { RatingComponent } from "components/sledge/review";
import parseGid from "lib/shopify/parse-gid";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "./link";

interface IProductCard {
  product: Product & {
    variants: { sku: any }[];
  };
  className?: string;
}

export function ProductCard({ product }: IProductCard) {
  const { featuredImage, handle, title, vendor } = product;
  const firstVariant: any = product.variants[0];

  if (!firstVariant) return null;

  return (
    <div
      key={product.id}
      className="group relative product-card min-w-fit lg:min-w-[270px] lg:max-w-min rounded-[21.593px] border-[0.9px] border-solid border-dark5 "
    >
      <div>
        <Trigger
          params={{
            productId: parseGid(product.id).id,
            productVariantId: parseGid(firstVariant.id).id,
            productName: product.title,
            productVendor: product.vendor,
            productSku: firstVariant.sku,
            productVariantName: `${firstVariant.selectedOptions?.[0]?.value} / ${firstVariant?.selectedOptions?.[1]?.value}`,
            productLink: `${process.env.NEXT_PUBLIC_STORE_URL}/products/${product.handle}`,
            productImage: featuredImage?.url || featuredImage?.url,
            productCurrency: firstVariant.price?.currencyCode,
            productPrice: firstVariant.price.amount,
          }}
        />

        <div className="aspect-h-1 bg-dark2 aspect-w-1 w-full overflow-hidden rounded-t-[24px] lg:aspect-none group-hover:opacity-75 lg:max-h-[270px] h-fit lg:h-[270px] flex justify-center items-center">
          <Image
            src={featuredImage.url}
            alt={product.title}
            sizes="(min-width: 45em) 20vw, 100vw"
            width={featuredImage.width}
            height={featuredImage.height}
            blurDataURL="URL"
            placeholder="blur"
            priority={true}
          />
        </div>
        <div className="mt-[16px] space-y-[8px] px-[16px] pb-[16.69px]">
          <div className="flex justify-between">
            <Price
              className="font-bold text-[21.59px] leading-[25.91px]"
              currencyCode="USD"
              amount={String(firstVariant?.price.amount)}
              currencyCodeClassName="hidden"
            />
            <div className="flex border-[0.9px] border-solid border-dark3 rounded-[323.9px] w-fit">
              <div className="flex px-[9px] py-[3.6px] justify-center items-center">
                <p className="text-dark4 font-inter text-[10.8px] leading-[17.27px] tracking-[-0.216px]">
                  Vendor: {vendor}
                </p>
              </div>
            </div>
          </div>
          <RatingComponent size="xs" productId={product.id} />
          <div>
            <Link
              className="text-[18px] leading-[21.6px] font-bold "
              href={"/product/" + handle}
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {title}
            </Link>
          </div>
        </div>
      </div>
      <div className="px-[16px] pb-[16px]">
        <AddToCart
          autoSelect={true}
          variants={product.variants}
          availableForSale={product.availableForSale}
        />
      </div>
    </div>
  );
}
