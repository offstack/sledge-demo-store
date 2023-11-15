import { CollectionCard } from "components/global";
import { getCollections } from "lib/shopify";

export default async function Page() {
  const collections = await getCollections({ limit: 10 });

  return (
    <div className="mt-[50px] lg:mt-[100px] max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <div className="flex flex-wrap gap-x-[28px] gap-y-[30px] mt-[40px]">
        {collections.map((collection, index) => {
          let colSize = "";
          let imageSize = "";
          switch (index) {
            case 0:
              colSize = "w-full md:w-[48%] xl:w-[672px] h-[380px]";
              imageSize = "w-[366px] h-[366px]";
              break;
            case 1:
              colSize = "w-full md:w-[48%] xl:w-[470px] h-[380px]";
              imageSize = "w-[394px] h-[365px]";
              break;
            case 2:
              colSize = "w-full md:w-[48%] xl:w-[470px] h-[380px]";
              imageSize = "w-[383px] h-[366px]";
              break;
            case 3:
              colSize = "w-full md:w-[48%] xl:w-[672px] h-[380px]";
              imageSize = "w-[353px] h-[353px]";
              break;
            default:
              break;
          }
          return (
            <CollectionCard
              colSize={colSize}
              imageSize={imageSize}
              collection={collection}
              key={collection.id}
            />
          );
        })}
      </div>
    </div>
  );
}
