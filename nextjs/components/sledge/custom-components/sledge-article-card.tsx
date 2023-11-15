import { Link } from "components/global";
import { ReactNode } from "react";

export const SledgeArticleCard = ({
  data,
}: {
  data: {
    title: string;
    image: any;
    body_html: ReactNode | ReactNode[] | string;
    summary_html: ReactNode | ReactNode[] | string;
    published_at: string;
    blog_handle: string;
    handle: string;
  };
}) => {
  const {
    title,
    image,
    body_html,
    summary_html,
    published_at,
    blog_handle,
    handle,
  } = data;

  const imageUrl =
    image?.src || "https://sledgeassets.nyc3.cdn.digitaloceanspaces.com/images/blank-image.png";
  return (
    <div className="relative h-full flex flex-col justify-between border-[0.9px] border-solid border-dark5 rounded-[21.593px]">
      <div>
        <Link href={`/blogs/${blog_handle}/${handle}`} className="w-full block">
          <img
            className="h-[200px] w-full rounded-t-[21.593px] object-cover"
            src={imageUrl}
            alt="sledge-card-image"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="mt-[16px] px-[16px]">
        <Link href={`/blogs/${blog_handle}/${handle}`}>
          <div className="text-white text-[21.593px] font-bold leading-[25.912px]">
            {title}
          </div>
        </Link>
      </div>
      <div className="mt-[8px] px-[16px] pb-[16px]">
        <div className="w-fit px-[9px] py-[3.6px] rounded-[323.9px] border-[0.9px] border-solid border-dark3 text-dark4 font-inter text-[10.797px] leading-[17.275px] tracking-[-0.216px]">
          {new Date(published_at).toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
        <div className="mt-[15.72px] text-dark4 font-inter text-[14px] leading-[22.4px] tracking-[-0.28px]">
          {!summary_html ? null : summary_html}
        </div>
        <Link
          href={`/blogs/${blog_handle}/${handle}`}
          className="group/article-button product-form__submit button relative z-10 inline-flex mt-[16px] items-center py-[11px] px-[16.33px] border-[0.9px] border-solid border-dark3 rounded-[323.9px] hover:bg-yellow disabled:bg-dark10 active:bg-yellow2 text-yellow hover:text-black active:text-black disabled:text-dark4 transition duration-200 w-full justify-center"
        >
          <span className="sledge-icon__note">
            <svg
              width={16}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover/article-button:fill-black fill-yellow group-disabled/article-button:fill-dark4 group-active/article-button:fill-black"
            >
              <g id="vuesax/bold/note-2">
                <path
                  id="Vector"
                  d="M8.95178 13.3046C9.13494 13.3473 9.15172 13.5871 8.97332 13.6466L7.91998 13.9933C5.27332 14.8466 3.87998 14.1333 3.01998 11.4866L2.16665 8.85328C1.31332 6.20661 2.01998 4.80661 4.66665 3.95328L4.67731 3.94975C5.08018 3.81633 5.48102 4.22359 5.37901 4.63553C5.37264 4.66126 5.3663 4.68718 5.35998 4.71328L4.70665 7.50661C3.97332 10.6466 5.04665 12.3799 8.18665 13.1266L8.95178 13.3046Z"
                  fill="#000000"
                  className="group-hover/article-button:fill-black fill-yellow group-disabled/article-button:fill-dark4 group-active/article-button:fill-black"
                />
                <path
                  id="Vector_2"
                  d="M11.9467 2.14033L10.8334 1.88033C8.6067 1.35366 7.28004 1.787 6.50004 3.40033C6.30004 3.807 6.14004 4.30033 6.00671 4.867L5.35337 7.66033C4.70004 10.447 5.56004 11.8203 8.34004 12.4803L9.46004 12.747C9.8467 12.8403 10.2067 12.9003 10.54 12.927C12.62 13.127 13.7267 12.1537 14.2867 9.747L14.94 6.96033C15.5934 4.17366 14.74 2.79366 11.9467 2.14033ZM10.6934 8.887C10.6334 9.11366 10.4334 9.26033 10.2067 9.26033C10.1667 9.26033 10.1267 9.25366 10.08 9.247L8.14004 8.75366C7.87337 8.687 7.71337 8.41366 7.78004 8.147C7.84671 7.88033 8.12004 7.72033 8.38671 7.787L10.3267 8.28033C10.6 8.347 10.76 8.62033 10.6934 8.887ZM12.6467 6.63366C12.5867 6.86033 12.3867 7.007 12.16 7.007C12.12 7.007 12.08 7.00033 12.0334 6.99366L8.80004 6.17366C8.53337 6.107 8.37337 5.83366 8.44004 5.567C8.50671 5.30033 8.78004 5.14033 9.04671 5.207L12.28 6.027C12.5534 6.087 12.7134 6.36033 12.6467 6.63366Z"
                  className="group-hover/article-button:fill-black fill-yellow group-disabled/article-button:fill-dark4 group-active/article-button:fill-black"
                  fill="#000000"
                />
              </g>
            </svg>
          </span>
          <span className="font-inter text-[12px] lg:text-[14px] font-semibold leading-[15.4px] tracking-[-0.56px] ml-[8px] text-yellow group-hover/article-button:text-black">
            View Article
          </span>
        </Link>
      </div>
    </div>
  );
};
