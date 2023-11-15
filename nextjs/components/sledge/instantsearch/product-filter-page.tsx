"use client";

import { CustomComponents } from "@sledge-app/core";
import { ProductFilterWidget } from "@sledge-app/react-instant-search";
import parseGid from "lib/shopify/parse-gid";
import { SledgeProductCard } from "../custom-components";

type IPLP = {
  collection: any;
};
export default function ProductFilter({ collection }: IPLP) {
  return (
    <ProductFilterWidget
      query={{
        keyword: "q",
      }}
      params={{
        collectionId: Number(parseGid(collection?.id).id),
      }}
    >
      <CustomComponents productCard={SledgeProductCard} />
    </ProductFilterWidget>
  );
}
