import ProductFilter from "components/sledge/instantsearch/product-filter-page";
import { getCollection } from "lib/shopify";

export default async function Page({ params, searchParams }: any) {
  const collection: any = await getCollection(params.handle);

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <ProductFilter collection={collection} />
    </div>
  );
}
