import { Link } from "components/global";
import Image from "next/image";

export function CollectionCard({
  collection,
  imageSize,
  colSize,
}: {
  collection: any;
  imageSize: any;
  colSize: string;
}) {
  return (
    <Link
      href={"/collections/" + collection.handle}
      className={`bg-dark2 rounded-[16px] pl-[24px] pb-[24px] flex relative {{ col_size }} z-[2] transition-all duration-200 hover:opacity-75 ${colSize}`}
    >
      <div className="flex flex-col justify-end space-y-[12px]">
        <h3 className="font-bold text-[24px] leading-[26.4px] tracking-[-0.48px]">
          {collection.title}
        </h3>
        <div
          className="max-w-[283px] font-inter text-[14px] text-gray1 font-normal leading-[22.4px] tracking-[-0.28px]"
          dangerouslySetInnerHTML={{
            __html: collection.descriptionHtml,
          }}
        />
      </div>
      <Image
        className={"absolute right-0 z-[-1] " + imageSize}
        src={collection.image?.url}
        alt={collection.title}
        width={imageSize.split("w-[")[1].split("] h-[")[0].split("px")[0]}
        height={100}
        blurDataURL="URL"
        placeholder="blur"
      />
    </Link>
  );
}
