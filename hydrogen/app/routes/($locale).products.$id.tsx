import {Suspense, useMemo, useState} from 'react';
import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Await,
  useLocation,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import {Money, parseGid, ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {AnalyticsPageType, getSelectedProductOptions} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import type {MediaFragment, ProductQuery} from 'storefrontapi.generated';

import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {
  Image,
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {
  Accordions,
  AddToCartButton,
  Input,
  Link,
  ProductCard,
} from '~/components';

// Sledge Package
import {Rating} from '@sledge-app/react-product-review';
import {Widget} from '@sledge-app/react-product-review';
import {ButtonDetail} from '@sledge-app/react-wishlist';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderArgs) {
  const {id} = params;
  invariant(id, 'Missing id param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: id,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    return redirectToFirstVariant({product, request});
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: id,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  //overiding currency code
  selectedVariant.price.currencyCode = 'USD';

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer({
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

export function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const pathName = new URL(request.url).pathname;
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  throw redirect(`${pathName}?${searchParams.toString()}`, 302);
}

export default function MainProduct() {
  const {product, recommended} = useLoaderData<typeof loader>();
  const {media, selectedVariant} = product;

  const accordions = [
    {
      title: 'Materials',
      description: (
        <>
          <ul className="space-y-4">
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">Super Soft</p>
              <p className="text-sm font-[400]">
                This fabric is created with comfort in mind, and is made to be
                especially soft on skin.
              </p>
            </li>
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">
                Made from recycled materials
              </p>
              <p className="text-sm font-[400]">
                This fabric is made with recycled fibers and/or materials such
                as plastic bottles/waste, textile waste, recycled clothing,
                fishing nets, etc.
              </p>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Shipping & Returns',
      description: (
        <>
          <ul className="space-y-4">
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">Shipping & Delivery</p>
              <p className="text-sm font-[400]">
                Free shipping on all orders over $85.
              </p>
            </li>
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">Returns & Exchanges</p>
              <p className="text-sm font-[400]">This item is final sale.</p>
            </li>
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">Circularity</p>
              <p className="text-sm font-[400]">
                This item is eligible for our take back program that repurposes
                and recycles your old tentree clothing, so that nothing goes to
                waste.
              </p>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Dimensions',
      description: (
        <>
          <ul className="space-y-4">
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">
                Stretch: No/Minimal Stretch - This fabric does not stretch.
                Select the size that fits the widest part of your body for the
                best fit. Size up for a looser fit.
              </p>
            </li>
            <li className="space-y-2 list-disc ml-4">
              <p className="text-white/75 text-sm">
                Dimensions: SM: 56 cm & ML:58 cm circumference
              </p>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Care Instructions',
      description: (
        <>
          <div className="space-y-4">
            <div className="space-y-2 ml-4">
              <p className="text-white/75 text-sm">DO</p>
              <div className="text-sm font-[400]">
                <ul className="space-y-2">
                  <li className="list-disc ml-5">
                    Hand-wash or machine-wash at a low temperature (max. 30°C)
                  </li>
                  <li className="list-disc ml-5">
                    Select the wool wash cycle or delicates cycle
                  </li>
                  <li className="list-disc ml-5">
                    Eco-friendly wool wash detergent
                  </li>
                  <li className="list-disc ml-5">
                    Gently steam or iron at a warm setting
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-2 ml-4">
              <p className="text-white/75 text-sm">DON'T</p>
              <div className="text-sm font-[400]">
                <ul className="space-y-2">
                  <li className="list-disc ml-5">
                    Use bleach, softeners or harsh stain removers
                  </li>
                  <li className="list-disc ml-5">Tumble-dry </li>
                  <li className="list-disc ml-5">Wash too often</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'Share',
      description: (
        <>
          <ul className="flex justify-start mt-5 space-x-4">
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-dark4"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-dark4"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-dark4"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-dark4"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0">
      <div className="flex flex-wrap lg:flex-nowrap lg:items-start lg:gap-x-[50px] pt-[32px]">
        <ProductMedia media={media.nodes} product={product} />
        <div className="mt-7 sm:mt-16 lg:mt-0 w-full lg:w-[520px]">
          <ProductDetails product={product} selectedVariant={selectedVariant} />
          <ProductForm />
          <Accordions accordions={accordions} />
        </div>
      </div>
      <Widget.Root
        params={{
          productId: parseGid(product.id).id,
          productVariantId: parseGid(selectedVariant.id).id,
        }}
      >
        <Widget.Header>
          <Widget.Header.Summary />
          <Widget.Header.AddTrigger />
          <Widget.Header.Sort />
        </Widget.Header>
        <Widget.List />
      </Widget.Root>
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => <ProductRecommendation products={products.nodes} />}
        </Await>
      </Suspense>
    </div>
  );
}

export function ProductMedia({
  media,
  product,
}: {
  media: MediaFragment[];
  product: {title: string; featuredImage: Image};
}) {
  return (
    <div className="flex flex-col-reverse w-full lg:w-[600px]">
      <div className="mx-auto mt-[16px] lg:mt-[36px] w-full max-w-2xl block lg:max-w-none">
        <div
          className="flex overflow-x-auto grid-cols-3 gap-[20px] lg:gap-x-[calc(37px-2px)]"
          aria-orientation="horizontal"
          role="tablist"
        >
          {media.map((item, index) => {
            return (
              <button
                key={index}
                id="tabs-0-panel-0"
                className="relative cursor-default flex-none flex h-[100px] lg:h-[224px] w-[100px] lg:w-[223px] rounded-[16px] bg-dark2 hover:opacity-75"
                aria-controls="tabs-0-panel-0"
                role="tab"
                type="button"
              >
                <span className="sr-only">Angled view</span>
                <span className="absolute inset-0 overflow-hidden flex justify-center items-center">
                  <img
                    alt={product.title}
                    decoding="async"
                    height={143}
                    loading="lazy"
                    src={item.previewImage?.url}
                    width={143}
                    style={{aspectRatio: '143/143'}}
                    className="h-full w-full object-cover object-center"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="aspect-h-1 aspect-w-1 w-full">
        <div
          id="tabs-1-panel-1"
          aria-labelledby="tabs-1-tab-1"
          role="tabpanel"
          tabIndex={0}
          className="flex justify-center items-center bg-dark2 rounded-[32px] h-auto lg:h-[600px]"
        >
          <img
            alt={product.title}
            decoding="async"
            height="473.579"
            loading="lazy"
            src={product.featuredImage.url}
            width="473.579"
            style={{aspectRatio: '473.579/473.579'}}
            className="h-full w-full max-w-[473.579px] max-h-[473.579px] object-center object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function ProductDetails({
  product,
  selectedVariant,
}: {
  product: Product;
  selectedVariant: ProductVariant;
}) {
  return (
    <>
      <h2 className="max-w-[480px] font-bold text-[25px] lg:text-[40px] leading-[30px] lg:leading-[48px]">
        {product.title}
      </h2>
      <div className="mt-[12px] lg:mt-[16px] flex gap-[16px] items-center">
        <h3 className="sr-only">Reviews</h3>
        <Rating
          params={{
            productId: parseGid(product.id).id,
          }}
          size="sm"
        />
        <div className="flex border-[1px] border-solid border-dark3 rounded-[24px] w-fit">
          <div className="flex px-[10px] py-[4px] justify-center items-center">
            <p className="text-dark4 font-inter font-medium text-[10px] leading-[16px] tracking-[-0.2px]">
              Vendor: {product.vendor}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-[18px] lg:mt-[24px]">
        <div className="max-w-[480px]">
          <h2 className="sr-only">Description</h2>
          <p
            className="font-inter font-medium text-[14px] text-dark4 lg:text-[16px] leading-[25.6px] tracking-[-0.32px]"
            dangerouslySetInnerHTML={{__html: product.description}}
          />
        </div>
      </div>
      <div className="mt-[18px] lg:mt-[24px] flex items-center gap-[12px]">
        <h2 className="sr-only">Product information</h2>
        <Money
          className="font-[700] text-sledge-color-text-primary text-[26px] lg:text-[32px] leading-normal lg:leading-[38.4px]"
          data={selectedVariant.price}
          withoutTrailingZeros
        />
        {selectedVariant.compareAtPrice && (
          <Money
            className="font-sledge-font-family-1 line-through font-[400] text-[#FF7373] text-[12px] lg:text-[16px] leading-[25.6px] tracking-[-2%]"
            data={selectedVariant.compareAtPrice}
            withoutTrailingZeros
          />
        )}
      </div>
    </>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  ...props
}: any) {
  const {pathname} = useLocation();
  const isLangPathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLangPathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);

  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}

function ProductOptions({options, searchParamsWithDefaults}: any) {
  return (
    <>
      {options.map((option: any, index: number) => {
        {
          return (
            option.values.length && (
              <div key={index} className="mt-[24px]">
                <div className="flex items-center justify-between">
                  <h6 className="text-[18px] leading-[21.6px]">
                    {option.name}
                  </h6>
                </div>
                <fieldset className="mt-[14px]">
                  <legend className="sr-only">Choose a {option.name}</legend>
                  <div className="flex flex-wrap gap-[16px]">
                    {option.values.length &&
                      option.values.map((value: any, idx: any) => {
                        const checked =
                          searchParamsWithDefaults.get(option.name) === value;
                        const id = `option-${option.name}-${value}`;

                        const colorStyle = `block w-[30px] h-[30px] rounded-[360px] border-[1px] border-solid focus:outline-none cursor-pointer hover:opacity-75 ${
                          checked ? 'border-green' : 'border-gray-800'
                        }`;

                        const defaultStyle = `${
                          checked ? 'text-black bg-green' : 'text-dark4'
                        } font-inter lg:text-[16px] leading-[25.6px] tracking-[-0.32px] bg-dark2 py-[6px] px-[14px] rounded-[360px] hover:opacity-75`;

                        return (
                          <div key={id} className={id}>
                            <ProductOptionLink
                              optionName={option.name}
                              optionValue={value}
                              searchParams={searchParamsWithDefaults}
                              style={{backgroundColor: value}}
                              className={
                                option.name !== 'Color'
                                  ? defaultStyle
                                  : colorStyle
                              }
                            >
                              {option.name !== 'Color' ? value : ''}
                            </ProductOptionLink>
                          </div>
                        );
                      })}
                  </div>
                </fieldset>
              </div>
            )
          );
        }
      })}
    </>
  );
}

export function ProductForm() {
  const {product, analytics, storeDomain} = useLoaderData();

  const [currentSearchParams] = useSearchParams();
  const transition = useNavigation();

  const [quantity, setQuantity] = useState(1);

  /**
   * We update `searchParams` with in-flight request data from `transition` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    setQuantity(1);
    return transition.location
      ? new URLSearchParams(transition.location.search)
      : currentSearchParams;
  }, [currentSearchParams, transition]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo(() => {
    const clonedParams = new URLSearchParams(searchParams);

    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }

    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const hasOnlyDefaultVariant =
    firstVariant.selectedOptions[0].value !== 'Default Title';

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: quantity,
  };

  return (
    <div className="grid gap-10">
      <div className="grid">
        {hasOnlyDefaultVariant && (
          <ProductOptions
            options={product.options}
            searchParamsWithDefaults={searchParamsWithDefaults}
          />
        )}
        {selectedVariant && (
          <div className="grid items-stretch">
            <>
              <div className="mt-[24px]">
                <h6 className="text-[18px] leading-[21.6px]">Quantity</h6>
                <div className="flex gap-[12px] mt-[16px] items-center">
                  <Input
                    type="quantity"
                    label="Quantity"
                    name="quantity"
                    placeholder=""
                    quantityState={quantity}
                    maxQuantity={selectedVariant.quantityAvailable}
                    setQuantityState={setQuantity}
                  />
                  {!selectedVariant.quantityAvailable ? (
                    ''
                  ) : (
                    <span className="font-inter text-dark4 font-medium text-[14px] leading-[22.4px] tracking-[-0.28px]">
                      Stock: {selectedVariant.quantityAvailable} pcs
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-[12px] mt-[32px] max-w-[350px]">
                <AddToCartButton
                  variant="icon"
                  isOutOfStock={isOutOfStock}
                  lines={[
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: quantity,
                    },
                  ]}
                  analytics={{
                    products: [productAnalytics],
                    totalValue: parseFloat(productAnalytics.price),
                  }}
                  storeDomain={storeDomain}
                  selectedVariant={selectedVariant}
                  quantity={quantity}
                />
                <ButtonDetail
                  params={{
                    productId: product.id,
                    productVariantId: firstVariant.id,
                    productVariantName: firstVariant.title,
                    productName: product.title,
                    productVendor: product.vendor,
                    productSku: product.sku,
                    productLink: `https://sledge-demo.myshopify.com/products/${product.handle}`,
                    productImage: product.featuredImage.url,
                    productCurrency: firstVariant.price.currencyCode,
                    productPrice: firstVariant.price.amount,
                  }}
                />
              </div>
            </>
            {/* {!isOutOfStock && (
              <ShopPayButton
                className="flex"
                variantIds={[selectedVariant?.id]}
                storeDomain={storeDomain}
              />
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductRecommendation({products}: {products: any}) {
  return (
    <div className="gap-[36px] flex flex-col mt-[12px]">
      <h4 className="font-medium text-[24px] leading-[26.4px] tracking-[-0.48px]">
        You may also like
      </h4>
      <div className="flex overflow-scroll gap-x-[30px]">
        {products?.map((product: Product, index: number) => {
          return <ProductCard product={product} key={index} />;
        })}
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      featuredImage {
        id
        url
        width
        height
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
