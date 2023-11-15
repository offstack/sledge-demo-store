"use client";

import { CustomComponents } from "@sledge-app/core";
import { Widget, WidgetHeader } from "@sledge-app/react-wishlist";
import {
  SledgeProductCard,
  SledgeWishlistWidgetAlert,
} from "components/sledge/custom-components";

export default async function Wishlist({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
      <Widget.Root
        query={{
          shareId: "share",
        }}
        limitOptions={[12, 24, 36, 48, 120]}
      >
        <CustomComponents
          wishlistWidgetAlert={SledgeWishlistWidgetAlert}
          productCard={SledgeProductCard}
        />
        <WidgetHeader>
          <WidgetHeader.Title text="My Wishlist" />
          <WidgetHeader.SearchForm placeholder="Search product" />
          <WidgetHeader.ClearTrigger buttonText="Clear Wishlist" />
          <WidgetHeader.ShareTrigger buttonText="Share Wishlist" />
          <WidgetHeader.Sort />
          <WidgetHeader.Limit />
        </WidgetHeader>
        <Widget.List gridType="large" />
      </Widget.Root>
    </div>
  );
}
