import {useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {CustomComponents} from '@sledge-app/core';
import {ProductFilterWidget} from '@sledge-app/react-instant-search';
import {SledgeCustom} from '~/components';

export async function loader({params, context}: any) {
  const {handle} = params;
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
    },
  });

  if (!collection && handle !== 'all') {
    throw new Response(null, {status: 404});
  }

  return defer({
    collection,
  });
}

const seo = ({data}: any) => ({
  title: data?.collection?.title,
  description: data?.collection?.description.substr(0, 154),
});

export const handle = {
  seo,
};

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <div
      key={collection?.id}
      className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0"
    >
      <ProductFilterWidget
        query={{
          keyword: 'q',
        }}
        params={{
          collectionId: Number(parseGid(collection?.id).id),
        }}
      >
        <CustomComponents productCard={SledgeCustom.SledgeProductCard} />
      </ProductFilterWidget>
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
    }
  }
`;
