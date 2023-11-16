import NextLink, { type LinkProps } from "next/link";

interface ILink extends LinkProps {
  children?: any;
  className?: string;
  target?: "_blank" | string;
  rel?: string;
}

export default function Link({ children, ...props }: ILink) {
  return (
    <NextLink prefetch={true} {...props}>
      {children}
    </NextLink>
  );
}
