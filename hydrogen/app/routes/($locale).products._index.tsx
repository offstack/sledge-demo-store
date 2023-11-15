import {LoaderArgs, redirect} from '@shopify/remix-oxygen';

export async function loader({request, context, params}: LoaderArgs) {
  const {storefront} = context;

  return redirect(storefront.i18n.pathPrefix + '/collections/all', 302);
}

export default function ProductsIndex() {
  return <></>;
}
