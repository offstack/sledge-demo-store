"use server";

import { CollectionCard, Link } from "components/global";
import { getCollections } from "lib/shopify";

export async function CollectionList() {
  const collections = await getCollections({ limit: 4 });

  return (
    <>
      <div className="mt-[50px] lg:mt-[100px] max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
        <div className="flex justify-between">
          <h4 className="text-xl lg:text-[48px] font-bold">Collections</h4>
          <Link
            href="/collections"
            className="bg-yellow relative z-10 inline-flex items-center py-[10px] px-[25px] lg:py-[16px] lg:px-[32px] rounded-[360px] text-black transition duration-200 w-fit justify-center hover:opacity-75"
          >
            <span className="font-inter text-[14px] lg:text-[16px] font-bold leading-[17.6px] tracking-[-0.32px]">
              Show All Collections
            </span>
            <svg
              className="ml-[10px]"
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8.79405C3 8.50928 3.21162 8.27393 3.48617 8.23669L3.5625 8.23155L13.4505 8.232L9.87826 4.67435C9.65812 4.45516 9.65735 4.099 9.87655 3.87886C10.0758 3.67873 10.3883 3.6599 10.6088 3.82282L10.672 3.87715L15.2095 8.39515C15.2386 8.42404 15.2638 8.45531 15.2852 8.48833C15.2912 8.49827 15.2973 8.50844 15.3032 8.51882C15.3085 8.52771 15.3134 8.53694 15.318 8.54627C15.3243 8.55986 15.3305 8.57389 15.3361 8.58821C15.3407 8.59925 15.3445 8.60998 15.348 8.62081C15.3522 8.63423 15.3562 8.64853 15.3597 8.66305C15.3622 8.67318 15.3643 8.68294 15.3661 8.69274C15.3686 8.70731 15.3707 8.72239 15.3722 8.73765C15.3735 8.74929 15.3743 8.76082 15.3747 8.77236C15.3749 8.77936 15.375 8.78669 15.375 8.79405L15.3747 8.81584C15.3743 8.82688 15.3735 8.83791 15.3725 8.84891L15.375 8.79405C15.375 8.82955 15.3717 8.86427 15.3654 8.89795C15.364 8.90599 15.3622 8.91425 15.3603 8.92247C15.3563 8.9394 15.3517 8.95571 15.3464 8.97169C15.3438 8.97964 15.3407 8.98812 15.3375 8.99654C15.3309 9.01347 15.3238 9.0296 15.3159 9.04532C15.3122 9.05271 15.3082 9.06045 15.3039 9.06811C15.2968 9.0806 15.2896 9.09247 15.2819 9.10404C15.2765 9.11224 15.2706 9.12076 15.2643 9.12915L15.2594 9.13563C15.2443 9.15543 15.2278 9.1742 15.2102 9.1918L15.2096 9.19232L10.6721 13.7111C10.4519 13.9303 10.0958 13.9295 9.87658 13.7094C9.67729 13.5093 9.65979 13.1968 9.82363 12.9769L9.87823 12.9139L13.449 9.357L3.5625 9.35655C3.25184 9.35655 3 9.10471 3 8.79405Z"
                fill="black"
              />
            </svg>
          </Link>
        </div>
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
      <div className="mt-[48px] flex justify-center grid-cols-3">
        <Link
          href="/collections"
          className="relative border-[1px] border-solid border-green z-10 inline-flex items-center py-[10px] px-[25px] lg:py-[16px] lg:px-[32px] rounded-[360px] text-black transition duration-200 w-fit justify-center hover:opacity-75"
        >
          <span className="font-inter font-bold text-[14px] lg:text-[16px] leading-[17.6px] tracking-[-0.32px] text-green">
            Show All Collections
          </span>
        </Link>
      </div>
    </>
  );
}
