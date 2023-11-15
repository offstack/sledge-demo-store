import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {Link} from '~/components';
import {seoPayload} from '~/lib/seo.server';
import {CACHE_SHORT} from '~/data/cache';

export const loader = async ({request, context: {storefront}}: LoaderArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {blogs} = await storefront.query(BLOGS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  const seo = seoPayload.blogIndex();

  return defer(
    {seo, blogs},
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
};

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();

  return (
    <div className="blogs max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <div className="blogs-grid mt-[40.5px] gap-6 xl:gap-[30px] grid grid-cols-1 sm:grid-cols-2">
        <Pagination connection={blogs}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((blog: {handle: string; title: string} | any) => {
                  return (
                    <Link
                      className="blog border border-dark4/40 py-10 text-center"
                      key={blog.handle}
                      to={`/blogs/${blog.handle}`}
                    >
                      <h2 className="text-[48px] leading-[52.8px] font-bold">
                        {blog.title}
                      </h2>
                    </Link>
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

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;
