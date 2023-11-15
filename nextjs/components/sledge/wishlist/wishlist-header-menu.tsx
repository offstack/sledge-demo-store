"use client";

import { Badge } from "@sledge-app/react-wishlist";
import { Link } from "components/global";

export default function WishlistHeaderMenu() {
  return (
    <Link className="mt-[-1px]" href="/wishlist">
      <Badge.Root>
        <Badge.HeaderMenu />
      </Badge.Root>
    </Link>
  );
}
