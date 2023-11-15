"use client";

import { ButtonDetail } from "@sledge-app/react-wishlist";
import parseGid from "lib/shopify/parse-gid";
import { Product } from "lib/shopify/types";

export default function WishlistButtonDetail({
  product,
}: {
  product: Product & {
    variants?: any;
  };
}) {
  return (
    <ButtonDetail
      params={{
        productId: parseGid(product?.id || "").id,
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
