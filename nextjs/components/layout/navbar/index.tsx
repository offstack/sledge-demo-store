import Cart from "components/cart";
import OpenCart from "components/cart/open-cart";
import { Link, Logo } from "components/global";
import { SearchHeaderMenu } from "components/sledge/instantsearch";
import { WishlistHeaderMenu } from "components/sledge/wishlist";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import { Suspense } from "react";
import MenuItem from "./menu-item";
import MobileMenu from "./mobile-menu";

export default async function Navbar() {
  const menu = await getMenu("main-menu");

  return (
    <header className="bg-dark">
      <nav
        className="flex items-center justify-between py-[24px] max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 border-b border-solid border-dark5"
        aria-label="Mega Menu"
      >
        <div className="flex items-center gap-x-[180px]">
          <Link href="/" className="-m-1.5 p-1.5 flex gap-[12px] items-center">
            <Logo />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-[32px]">
          {menu.map((item: Menu) => {
            return <MenuItem item={item} />;
          })}
        </div>
        <div className="flex lg:hidden">
          <MobileMenu
            menu={menu}
            cartDrawerComponent={
              <>
                <Suspense fallback={<OpenCart />}>
                  <Cart type={"mobile"} />
                </Suspense>
              </>
            }
          />
        </div>
        <div className="lg:flex gap-[20px] absolute lg:relative">
          <div className="mt-[-1px] hidden lg:block">
            <SearchHeaderMenu />
          </div>
          <div className="mt-[-1px] hidden lg:block">
            <WishlistHeaderMenu />
          </div>
          <Suspense fallback={<OpenCart />}>
            <Cart type={"desktop"} />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
