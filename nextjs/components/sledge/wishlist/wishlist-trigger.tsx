"use client";

import { Trigger } from "@sledge-app/react-wishlist";
import parseGid from "lib/shopify/parse-gid";
import { Product } from "lib/shopify/types";

export default function WishlistTrigger({
  product,
  parsedProductId,
}: {
  product: Product & {
    variants: { sku: any }[];
  };
  parsedProductId?: any;
}) {
  return (
    <Trigger
      params={{
        productId: parsedProductId,
        productVariantId: parseGid(product?.variants?.[0]?.id || "").id,
        productName: product.title,
        productVendor: product.vendor,
        productSku: product.variants?.[0]?.sku || "",
        productVariantName: `${product.variants[0]?.title}`,
        productLink: `${process.env.NEXT_PUBLIC_STORE_URL}/products/${product.handle}`,
        productImage: product.featuredImage?.url,
        productCurrency: "USD",
        productPrice: product.variants?.[0]?.price?.amount,
      }}
    />
  );
}
