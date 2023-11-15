import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {Await, useLoaderData} from '@remix-run/react';
import {defer, LoaderArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {CollectionCard, Link} from '~/components';
import {CACHE_SHORT} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export async function loader({request, context}: LoaderArgs) {
  const {language, country} = context.storefront.i18n;

  const {collections} = await context.storefront.query(
    FEATURED_COLLECTIONS_QUERY,
    {
      variables: {
        country,
        language,
      },
    },
  );

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return defer(
    {
      collections,
      seo,
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <Suspense>
      <Await resolve={collections}>
        {({nodes}) => {
          return !nodes ? null : <Collection collections={nodes}></Collection>;
        }}
      </Await>
    </Suspense>
  );
}

export function Collection({
  collections,
}: {
  collections: Pick<
    StorefrontAPI.Collection,
    'id' | 'title' | 'handle' | 'descriptionHtml' | 'image'
  >[];
}) {
  return (
    <div className="mt-[50px] lg:mt-[100px] max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <div className="flex flex-wrap gap-x-[28px] gap-y-[30px] mt-[40px]">
        {collections.map((collection, index) => {
          let colSize = '';
          let imageSize = '';
          switch (index) {
            case 0:
              colSize = 'w-full md:w-[48%] xl:w-[672px] h-[380px]';
              imageSize = 'w-[366px] h-[366px]';
              break;
            case 1:
              colSize = 'w-full md:w-[48%] xl:w-[470px] h-[380px]';
              imageSize = 'w-[394px] h-[365px]';
              break;
            case 2:
              colSize = 'w-full md:w-[48%] xl:w-[470px] h-[380px]';
              imageSize = 'w-[383px] h-[366px]';
              break;
            case 3:
              colSize = 'w-full md:w-[48%] xl:w-[672px] h-[380px]';
              imageSize = 'w-[353px] h-[353px]';
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

export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 4,
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;
