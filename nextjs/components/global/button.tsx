import { Link } from "components/global";
import LoadingDots from "components/loading-dots";
import React from "react";

export function Button({
  text = "",
  type,
  loading,
  disabledProps,
  isArrow = true,
  as = "button",
  className = "",
  iconClass = "ml-[13px]",
  icon = <ArrowIcon iconClass={iconClass} />,
  ...props
}: {
  text?: string;
  icon?: React.ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  loading?: any;
  disabledProps?: any;
  as?: React.ElementType;
  isArrow?: boolean;
  className?: string;
  iconClass?: string;
  [key: string]: any;
}) {
  const Component = props?.href ? Link : as;
  return (
    <Component
      type={type}
      className={`h-fit font-semibold text-black bg-green font-inter text-[14px] leading-[15.4px] tracking-[-0.56px] py-[10px] md:py-[12px] px-[14px] md:px-[16px] rounded-[323.9px] disabled:opacity-70 ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <LoadingDots className="bg-dark6" /> : text}
      {!loading && isArrow && icon}
    </Component>
  );
}

export function ArrowIcon({ iconClass }: { iconClass: string }) {
  return (
    <svg
      className={`inline ${iconClass}`}
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.2373 4.00146L14.3333 8.09745L10.2373 12.1934"
        stroke="black"
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.86133 8.09766H14.2181"
        stroke="black"
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
