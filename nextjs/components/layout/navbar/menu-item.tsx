"use client";

import { Link } from "components/global";
import { usePathname } from "next/navigation";

function MenuItem({ item }: { item: { title: string; path: string } }) {
  const pathName = usePathname();

  return (
    <Link
      key={item.title}
      href={item.path}
      className={`${
        pathName === item.path ? "text-green" : "text-white"
      }  text-[16px] font-inter leading-[17.6px] tracking-[-0.32px] hover:text-green transition duration-200`}
    >
      {item.title}
    </Link>
  );
}

export default MenuItem;
