import {useLoaderData} from '@remix-run/react';
import {json, type LoaderArgs, type MetaFunction} from '@shopify/remix-oxygen';

import invariant from 'tiny-invariant';
import {seoPayload} from '~/lib/seo.server';

import {routeHeaders} from '~/data/cache';
import {Contact, Link, SledgeCustom} from '~/components';

// Sledge Package
import {Widget, WidgetHeader} from '@sledge-app/react-wishlist';
import {CustomComponents} from '@sledge-app/core';
import {SearchResultWidget} from '@sledge-app/react-instant-search';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderArgs) {
  const {pageHandle} = params;
  invariant(params.pageHandle, 'Missing page handle');

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: pageHandle || '',
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const pages = ['wishlist', 'contact', 'search-result'];
  const seo = seoPayload.page({page, url: request.url});

  return json({page, seo, pages, pageHandle});
}

export function DynamicPages({pageHandle, page}: any) {
  switch (pageHandle) {
    case 'wishlist':
      return (
        <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
          <Wishlist />
        </div>
      );
    case 'contact-us':
      return (
        <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
          <Contact />
        </div>
      );
    case 'search-result':
      return (
        <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8">
          <SearchResultWidget
            query={{
              keyword: 'q',
            }}
          >
            <CustomComponents
              productCard={SledgeCustom.SledgeProductCard}
              articleCard={SledgeCustom.SledgeArticleCard}
              blogCard={SledgeCustom.SledgeBlogCard}
            />
          </SearchResultWidget>
        </div>
      );
    default:
      return (
        <div>
          <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
            <img
              src="/assets/images/photo-1581084324492-c8076f130f86.avif"
              alt={'Page Header'}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div
              className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
              aria-hidden="true"
            >
              <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" />
            </div>
            <div
              className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
              aria-hidden="true"
            >
              <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" />
            </div>
            <div className="mx-auto px-6 lg:px-8">
              <div className="mx-auto">
                <h2 className="text-white text-center text-xl lg:text-[48px] font-bold">
                  {page?.title}
                </h2>
              </div>
            </div>
          </div>
          <div
            className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 my-8"
            dangerouslySetInnerHTML={{__html: page?.body}}
          />
        </div>
      );
  }
}

export default function PagesIndexId() {
  const data = useLoaderData();
  const {pageHandle, page} = data;

  return <DynamicPages pageHandle={pageHandle} page={page} />;
}

export function Wishlist() {
  return (
    <Widget.Root
      query={{
        shareId: 'share',
      }}
      limitOptions={[12, 24, 36, 48, 120]}
    >
      <CustomComponents
        wishlistWidgetAlert={SledgeCustom.SledgeWishlistWidgetAlert}
        productCard={SledgeCustom.SledgeProductCard}
      />
      <WidgetHeader>
        <WidgetHeader.Title text="My Wishlist" />
        <WidgetHeader.SearchForm placeholder="Search product" />
        <WidgetHeader.ClearTrigger buttonText="Clear Wishlist" />
        <WidgetHeader.ShareTrigger buttonText="Share Wishlist" />
        <WidgetHeader.Sort />
        <WidgetHeader.Limit />
      </WidgetHeader>
      <Widget.List gridType="large" />
    </Widget.Root>
  );
}

export function CatchBoundary() {
  return <h1>Page Not Found</h1>;
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
