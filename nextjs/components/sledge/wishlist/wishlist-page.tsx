"use client";

import { CustomComponents } from "@sledge-app/core";
import { Widget, WidgetHeader } from "@sledge-app/react-wishlist";
import {
  SledgeProductCard,
  SledgeWishlistWidgetAlert,
} from "../custom-components";
export default function WishlistPage({
  data,
  dataInfo,
  dataReviews,
}: {
  data?: any;
  dataInfo?: any;
  dataReviews: any;
}) {
  return (
    <div className="max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1290px] m-auto">
      <Widget.Root
        query={{
          shareId: dataInfo?.share_id,
        }}
        limitOptions={[12, 24, 36, 48, 120]}
        // data={data}
        // dataInfo={dataInfo}
        // dataReviews={dataReviews}
      >
        <CustomComponents
          wishlistWidgetAlert={SledgeWishlistWidgetAlert}
          productCard={SledgeProductCard}
        />
        <Widget.Header>
          <WidgetHeader.Title text="My Wishlist" />
          <WidgetHeader.SearchForm placeholder="Search product" />
          <WidgetHeader.ClearTrigger buttonText="Clear Wishlist" />
          <WidgetHeader.ShareTrigger buttonText="Share Wishlist" />
          <WidgetHeader.Sort />
          <WidgetHeader.Limit />
        </Widget.Header>
        <Widget.List gridType="large" />
      </Widget.Root>
    </div>
  );
}
