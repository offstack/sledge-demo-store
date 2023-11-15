"use client";

import { Rating } from "@sledge-app/react-product-review";
import parseGid from "lib/shopify/parse-gid";

type iRatingComponent = {
  size?: "md" | "sm" | "xs";
  productId?: any;
};
export default function RatingComponent({
  size = "sm",
  productId,
}: iRatingComponent) {
  return <Rating size={size} params={{ productId: parseGid(productId).id }} />;
}
