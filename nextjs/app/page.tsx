import { CollectionList, ProductLists } from "components/global";

export const runtime = "edge";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  return (
    <>
      <ProductLists />
      <CollectionList />
    </>
  );
}
