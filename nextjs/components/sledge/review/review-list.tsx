"use client";

import { Widget, WidgetHeader } from "@sledge-app/react-product-review";
import parseGid from "lib/shopify/parse-gid";
import { Product } from "lib/shopify/types";

type IReviewList = {
  product: Product;
  selectedVariantId?: string;
};
export default function ReviewWidget({
  product,
  selectedVariantId,
}: IReviewList) {
  return (
    <Widget.Root
      params={{
        productId: parseGid(product.id).id,
        productVariantId: selectedVariantId
          ? parseGid(selectedVariantId)?.id
          : "",
      }}
    >
      <Widget.Header>
        <WidgetHeader.Summary />
        <WidgetHeader.AddTrigger />
        <WidgetHeader.Sort />
      </Widget.Header>
      <Widget.List />
    </Widget.Root>
  );
}
