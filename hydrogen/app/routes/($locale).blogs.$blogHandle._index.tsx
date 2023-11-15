import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type V2_MetaFunction} from '@remix-run/react';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleFragment} from 'storefrontapi.generated';
import {seoPayload} from '~/lib/seo.server';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.blog.title} blog`}];
};

export const loader = async ({
  request,
  params,
  context: {storefront},
}: LoaderArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  });

  const seo = seoPayload.blog({
    blog,
    url: request.url,
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  return defer({blog, seo});
};

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="blog max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
      <h1 className="text-[48px] leading-[52.8px] font-bold">{blog.title}</h1>
      <div className="blog-grid mt-[40.5px] gap-6 xl:gap-[30px] grid grid-cols-1 sm:grid-cols-2">
        <Pagination connection={articles}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((article, index) => {
                  return (
                    <ArticleItem
                      article={article}
                      key={article.id}
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                  );
                })}
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </>
            );
          }}
        </Pagination>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <div className="blog-article" key={article.id}>
      <div>
        {article.image && (
          <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
            <div className="blog-article-image">
              <Image
                alt={article.image.altText || article.title}
                aspectRatio="3/2"
                data={article.image}
                loading={loading}
                sizes="(min-width: 768px) 50vw, 100vw"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
            </div>
          </Link>
        )}
        <h3 className="text-[24px] leading-[28.8px] font-bold mt-[24px]">
          <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
            {article.title}
          </Link>
        </h3>
        <div className="rte mt-[12px] text-dark4">
          {article.excerpt.length ? article.excerpt : article.content}
        </div>
        <p className="mt-[24px] text-yellow">
          <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
            Read More
          </Link>
        </p>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $startCursor: String
    $blogHandle: String!
    $first: Int
    $last: Int
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    content
    excerpt
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
