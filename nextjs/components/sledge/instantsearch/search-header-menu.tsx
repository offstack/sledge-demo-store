"use client";

import { CustomComponents } from "@sledge-app/core";
import { SearchIconWidget } from "@sledge-app/react-instant-search";
import { SledgeSearchViewMoreResult } from "components/global";
import {
  SledgeOtherIndexList,
  SledgeProductCard,
  SledgeSuggestionKeywordList,
} from "../custom-components";

export default function SearchHeaderMenu() {
  return (
    <SearchIconWidget size="sm">
      <CustomComponents
        productCard={SledgeProductCard}
        searchViewMoreResult={SledgeSearchViewMoreResult}
        otherIndexList={SledgeOtherIndexList}
        suggestionKeywordList={SledgeSuggestionKeywordList}
      />
    </SearchIconWidget>
  );
}
