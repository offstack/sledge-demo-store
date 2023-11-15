import { Link } from "components/global";

export function SledgeWishlistWidgetAlert() {
  return (
    <div className="sledge-wishlist__widget-alert">
      <div className="sledge-wishlist__widget-alert-text">
        Please login to save your wishlist across devices.
        <Link href="/login" className="sledge-wishlist__widget-alert-link">
          <span className="ml-1">Login Here</span>
        </Link>
      </div>
    </div>
  );
}
