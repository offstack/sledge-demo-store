import {Money, parseGid, ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {getProductPlaceholder} from '~/lib/placeholders';

import {AddToCartButton, Link} from '..';
import type {ProductCardFragment} from 'storefrontapi.generated';

// Sledge Package
import {Trigger} from '@sledge-app/react-wishlist';
import {Rating} from '@sledge-app/react-product-review';

interface IProductCard {
  product: ProductCardFragment;
}
export function ProductCard({product}: IProductCard) {
  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;

  const {image} = firstVariant;

  const isOutOfStock = firstVariant?.availableForSale;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  firstVariant.price.currencyCode = 'USD';

  return (
    <div
      key={product.id}
      className="group relative product-card min-w-fit lg:min-w-[270px] lg:max-w-fit rounded-[21.593px] border-[0.9px] border-solid border-dark5 "
    >
      <div>
        <Trigger
          params={{
            productId: product.id,
            productVariantId: firstVariant.id,
            productName: product.title,
            productVendor: product.vendor,
            productSku: firstVariant.sku || '',
            productVariantName: firstVariant.title,
            productLink: `https://sledge-demo.myshopify.com/products/${product.handle}`,
            productImage: image?.url,
            productCurrency: firstVariant.price.currencyCode,
            productPrice: firstVariant.price.amount,
          }}
        />
        <div className="aspect-h-1 bg-dark2 aspect-w-1 w-full overflow-hidden rounded-t-[24px] lg:aspect-none group-hover:opacity-75 lg:max-h-[270px] h-fit lg:h-[270px] flex justify-center items-center">
          <Image
            src={image?.url}
            alt={product.title}
            sizes="(min-width: 45em) 20vw, 100vw"
          />
        </div>
        <div className="mt-[16px] space-y-[8px] px-[16px] pb-[16.69px]">
          <div className="flex justify-between">
            <Money
              className="font-bold text-[21.59px] leading-[25.91px]"
              data={firstVariant.price}
              withoutTrailingZeros
            />
            <div className="flex border-[0.9px] border-solid border-dark3 rounded-[323.9px] w-fit">
              <div className="flex px-[9px] py-[3.6px] justify-center items-center">
                <p className="text-dark4 font-inter text-[10.8px] leading-[17.27px] tracking-[-0.216px]">
                  Vendor: {product.vendor}
                </p>
              </div>
            </div>
          </div>
          <Rating
            params={{
              productId: parseGid(product.id).id,
            }}
            size="xs"
          />
          <div>
            <Link
              className="text-[18px] leading-[21.6px] font-bold "
              to={'/products/' + product.handle}
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </Link>
          </div>
        </div>
      </div>
      <div className="px-[16px] pb-[16px]">
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        />
      </div>
    </div>
  );
}
