"use client";

import { CustomComponents } from "@sledge-app/core";
import { SearchResultWidget } from "@sledge-app/react-instant-search";
import {
  SledgeArticleCard,
  SledgeBlogCard,
  SledgeCollectionCard,
  SledgeProductCard,
} from "../custom-components";

export default function SearchResultPage({ data }: { data?: any }) {
  return (
    <SearchResultWidget
      query={{
        keyword: "q",
      }}
    >
      <CustomComponents
        productCard={SledgeProductCard}
        blogCard={SledgeBlogCard}
        articleCard={SledgeArticleCard}
        collectionCard={SledgeCollectionCard}
      />
    </SearchResultWidget>
  );
}
