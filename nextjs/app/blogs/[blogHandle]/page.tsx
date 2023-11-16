import { Link } from "components/global";
import { getBlogs } from "lib/shopify";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { blogHandle: string };
}) {
  return {
    title:
      params?.blogHandle.charAt(0).toUpperCase() + params?.blogHandle.slice(1),
  };
}

export default async function Blogs({
  params,
}: {
  params: { blogHandle: string };
}) {
  const { blog } = await getBlogs({ limit: 8, blogHandle: params.blogHandle });
  const nodes: any[] = blog.articles.nodes;

  return (
    <div className="blog max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
      <h1 className="text-[48px] leading-[52.8px] font-bold">{blog.title}</h1>
      <div className="blog-grid mt-[40.5px] gap-6 xl:gap-[30px] grid grid-cols-1 sm:grid-cols-2">
        <>
          {nodes.map((article, index) => {
            return (
              <ArticleItem
                article={article}
                key={article.id}
                loading={index < 2 ? "eager" : "lazy"}
              />
            );
          })}
        </>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: any;
  loading?: HTMLImageElement["loading"];
}) {
  const publishedAt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article.publishedAt!));
  return (
    <div className="blog-article" key={article.id}>
      <div>
        {article.image && (
          <Link href={`/blogs/${article.blog.handle}/${article.handle}`}>
            <div className="blog-article-image">
              <Image
                alt={article.image.altText || article.title}
                src={article.image.url}
                loading={loading}
                width={article.image.width}
                height={article.image.height}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                }}
                blurDataURL="URL"
                placeholder="blur"
              />
            </div>
          </Link>
        )}
        <h3 className="text-[24px] leading-[28.8px] font-bold mt-[24px]">
          <Link href={`/blogs/${article.blog.handle}/${article.handle}`}>
            {article.title}
          </Link>
        </h3>
        <div className="rte mt-[12px] text-dark4">
          {article.excerpt.length ? article.excerpt : article.content}
        </div>
        <p className="mt-[24px] text-yellow">
          <Link href={`/blogs/${article.blog.handle}/${article.handle}`}>
            Read More
          </Link>
        </p>
      </div>
    </div>
  );
}
