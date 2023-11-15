import { Link } from "components/global";
import { getAllBlogs } from "lib/shopify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
};

export default async function Page() {
  const { blogs } = await getAllBlogs({ limit: 12 });
  const { nodes } = blogs;

  return (
    <div className="blogs max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <div className="blogs-grid mt-[40.5px] gap-6 xl:gap-[30px] grid grid-cols-1 sm:grid-cols-2">
        <>
          {nodes?.map((blog: { handle: string; title: string } | any) => {
            return (
              <Link
                className="blog border border-dark4/40 py-10 text-center"
                key={blog.handle}
                href={`/blogs/${blog.handle}`}
              >
                <h2 className="text-[48px] leading-[52.8px] font-bold">
                  {blog.title}
                </h2>
              </Link>
            );
          })}
        </>
      </div>
    </div>
  );
}
