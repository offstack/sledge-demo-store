import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/sledge-logo-hd.webp"
      width={99.91}
      height={30}
      alt="Sledge Logo"
      blurDataURL="URL"
      placeholder="blur"
    />
  );
}
