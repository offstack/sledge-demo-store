"use client";

import { Link, Logo } from "components/global";

export default async function Footer() {
  const footerMenu = [
    {
      text: "Summer",
      link: "/collections/summer-collection",
    },
    {
      text: "Winter",
      link: "/collections/winter-collection",
    },
    {
      text: "Spring",
      link: "/collections/spring-collection",
    },
    {
      text: "Autumn",
      link: "/collections/autumn-collection",
    },
    {
      text: "Cart Page",
      link: "/cart",
    },
    {
      text: "Search Page",
      link: "/pages/search-result?q=",
    },
    {
      text: "All Products",
      link: "/collections/all",
    },
    {
      text: "All Collections",
      link: "/collections",
    },
  ];

  const footerBottomMenu = [
    {
      text: "Privacy Policy",
      link: "https://sledge-app.com/supports/privacy-policy",
    },
    {
      text: "Terms & Conditions",
      link: "https://sledge-app.com/supports/terms-conditions",
    },
  ];

  const footerDescription =
    "Build instant search, product filters, wishlist, product review, etc. for your store using your preferred tech stacks — in just a few minutes.";

  const copyright = "Sledge Demo Store - Powered by Shopify";

  return (
    <div className="bg-dark2 pb-[32px] mt-[48px] lg:mt-[120px]">
      <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[53px]">
        <div className="max-w-fit mb-[24px]">
          <Link href={"/"}>
            <Logo></Logo>
          </Link>
        </div>
        <div className="flex flex-wrap justify-between gap-y-[50px] flex-col xl:flex-row">
          <div className="max-w-[419px]">
            <p className="text-[14px] md:text-[16px] leading=[25.6px] tracking-[-0.32px] font-inter text-[#B7B7B7]">
              {footerDescription}
            </p>
          </div>
          <ul className="flex [flex:_0_255px] flex-col flex-wrap  gap-y-[24px] h-[200px] text-[14px] md:text-[16px] leading-[22.4px] tracking-[-0.32px] font-inter">
            {footerMenu.map((item, index) => (
              <li key={"menu-item-" + index} className="w-auto md:w-[127.5px]">
                <Link
                  href={item.link}
                  className="text-[#B7B7B7] font-inter hover:text-green transition duration-200"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex  justify-between mt-[59.8px] font-inter flex-col md:flex-row items-center gap-y-4">
          <div>
            <p className="text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-[#B7B7B7]">
              {copyright}
            </p>
          </div>
          <ul className="flex text-[#B7B7B7] [&>*:nth-child(1)]:before:content-[''] [&>*:nth-child(1)]:before:ml-0 [&>*:nth-child(1)]:before:mr-0 text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em]">
            {footerBottomMenu.map((item, index) => (
              <li
                key={"bottom-menu-item-" + index}
                className="before:content-['|'] before:ml-2 before:mr-2"
              >
                <Link
                  className="text-[#B7B7B7] font-inter hover:text-green transition duration-200"
                  href={item.link}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
