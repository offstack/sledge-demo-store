import {CartForm, flattenConnection, Money, parseGid} from '@shopify/hydrogen';
import {FetcherWithComponents, FormMethod, useFetcher} from '@remix-run/react';
import {Button, Link} from '~/components';
import {CartAction} from '~/lib/type';
import {getInputStyleClasses} from '~/lib/utils';
import {useEffect, useState} from 'react';
import {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {useCartFetchers} from '~/hooks/useCartFetchers';

// Sledge Package
import {Rating} from '@sledge-app/react-product-review';

export function CartComponents({cart}: any) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);
  return <>{!linesCount ? <CartEmpty /> : <CartDetails cart={cart} />}</>;
}

export function CartDetails({cart}: any) {
  const {cost} = cart;
  const [removedItems, setRemovedItems] = useState([]);
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-[32px] leading-[35.2px] lg:text-[48px] font-bold lg:leading-[52.8px]">
          Your Cart
        </h2>
        <div className="lg:w-fit flex items-center text-white justify-center gap-x-6 lg:justify-start hover:opacity-70 transition duration-200 mt-0 !w-fit">
          <Button
            text="Continue shopping"
            isArrow={true}
            iconClass="ml-[8px]"
            to={'/collections/all'}
          />
        </div>
      </div>
      <MultipleRemoveItem
        removedItems={removedItems}
        setRemovedItems={setRemovedItems}
      />
      <div className="mt-8">
        <div className="hidden sm:flex min-w-full py-2 align-middle gap-[40px] flex-col overflow-x-auto pt-7">
          <CartTable
            linesObj={cart.lines}
            removedItems={removedItems}
            setRemovedItems={setRemovedItems}
          />
        </div>
        <div className="sm:hidden flex overflow-x-hidden min-w-full py-2 align-middle gap-[25px] flex-col pt-7">
          <CartLineMobile
            linesObj={cart.lines}
            removedItems={removedItems}
            setRemovedItems={setRemovedItems}
          />
        </div>
      </div>
      <div className="flex lg:justify-end">
        <div className="flex flex-col gap-[16px] w-full lg:w-[330px]">
          <CartSummary cost={cost} />
          {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
          <CartActions checkoutUrl={cart.checkoutUrl} />
        </div>
      </div>
    </>
  );
}

export function CartEmpty() {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:px-12 px-4 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Button
        text="Continue shopping"
        isArrow
        iconClass="ml-[8px]"
        to={'/collections/all'}
      />
    </div>
  );
}

export function CartTable({linesObj, removedItems, setRemovedItems}: any) {
  const lines = flattenConnection(linesObj);
  return (
    <table className="min-w-full divide-y divide-dark6">
      <thead>
        <tr>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pb-[10px]"
          ></th>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pb-[10px] pl-[15px]"
          >
            Product
          </th>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pl-[20px] pb-[10px]"
          >
            Quantity
          </th>
          <th
            scope="col"
            className="font-inter font-medium text-[14px] leading-[22.4px] tracking-[-0.28px] text-dark4 text-left pb-[10px]"
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-dark6 bg-dark">
        {lines.map((lineItem: any, index: any) => {
          const {merchandise, quantity} = lineItem;
          return (
            <tr key={index}>
              <td className="whitespace-nowrap">
                <div className="flex items-center lg:pl-[4px]">
                  <input
                    id={`cart-${merchandise.id}`}
                    type="checkbox"
                    className="custom-checkbox bg-transparent checked:bg-green h-[20px] w-[20px] text-green rounded-[4px] cursor-pointer focus:ring-green checked:bg-[url('/assets/images/check.png')] checked:[background-size:14px]"
                    name={merchandise.id}
                    value={lineItem.id}
                    autoComplete="off"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRemovedItems([...removedItems, lineItem.id]);
                      } else {
                        setRemovedItems(
                          removedItems.filter(
                            (item: any) => item !== lineItem.id,
                          ),
                        );
                      }
                    }}
                  />
                </div>
              </td>
              <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div className="flex items-center gap-[32px]">
                  <Link
                    to={'/products/' + merchandise.product.handle}
                    className="fflex-shrink-0 flex justify-center items-center mr-[15px] md:mr-[32px] bg-sledge-color-grey-4 rounded-[24px] hover:opacity-75"
                  >
                    <img
                      src={merchandise.image.url}
                      alt="Product Image"
                      width={merchandise.image.width}
                      height={merchandise.image.height}
                      className="w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] object-cover object-center"
                    />
                  </Link>
                  <div>
                    <h5 className="font-bold text-[20px] leading-[24px] text-white product-title">
                      {merchandise.product.title}
                    </h5>
                    <p className="text-dark4 text-[14px] leading-[22.4px] tracking-[-0.28px] mt-[12px] mb-[7px]">
                      Vendor: {merchandise.product.vendor} | SKU:{' '}
                      {merchandise.sku}{' '}
                    </p>
                    <Rating
                      params={{
                        productId: parseGid(merchandise.product.id).id,
                      }}
                      size="xs"
                    />
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap min-w-[120px] lg:min-w-fit">
                <CartQuantityAdjust line={lineItem} />
              </td>
              <td className="whitespace-nowrap min-w-[120px] lg:min-w-fit">
                <span className="font-sledge-font-family-2 text-[28px] md:text-[32px] leading-[38px] text-sledge-color-text-primary">
                  <strong>
                    <Money
                      data={lineItem.cost.totalAmount}
                      withoutTrailingZeros
                    />
                  </strong>
                </span>
              </td>
              <td className="whitespace-nowrap min-w-[60px] lg:min-w-fit">
                <ItemRemoveButton lineIds={[lineItem.id]} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function CartLineMobile({linesObj, removedItems, setRemovedItems}: any) {
  const lines = flattenConnection(linesObj);
  return (
    <>
      {lines.map((lineItem: any, index: any) => {
        const {merchandise, quantity} = lineItem;
        return (
          <>
            <div className="flex gap-[16px]">
              <div className="flex gap-[16px] min-w-[116px]">
                <input
                  id={`cart-${merchandise.id}`}
                  type="checkbox"
                  className="custom-checkbox ml-[4px] mt-[34px] bg-transparent checked:bg-green h-[20px] w-[20px] text-green rounded-[4px] cursor-pointer focus:ring-green checked:bg-[url('/assets/images/check.png')] checked:[background-size:14px]"
                  name={merchandise.id}
                  value={lineItem.id}
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRemovedItems([...removedItems, lineItem.id]);
                    } else {
                      setRemovedItems(
                        removedItems.filter(
                          (item: any) => item !== lineItem.id,
                        ),
                      );
                    }
                  }}
                />
                <Link
                  to={'/products/' + merchandise.product.handle}
                  className="flex-shrink-0 flex h-fit justify-center items-center mr-[15px] md:mr-[32px] bg-sledge-color-grey-4 rounded-[24px] hover:opacity-75"
                >
                  <img
                    src={merchandise.image.url}
                    alt="Product Image"
                    width={merchandise.image.width}
                    height={merchandise.image.height}
                    className="w-[80px] h-[80px] object-cover object-center"
                  />
                </Link>
              </div>
              <div className="flex flex-col w-full">
                <div>
                  <h5 className="font-bold text-[18px] leading-[21.6px] text-white product-title">
                    {merchandise.product.title}
                  </h5>
                  <p className="text-dark4 text-[12px] leading-[19.2px] tracking-[-0.24px] mt-[8px] mb-[4px]">
                    Vendor: {merchandise.product.vendor} | SKU:{' '}
                    {merchandise.sku}{' '}
                  </p>
                  <Rating
                    params={{
                      productId: merchandise.product.id,
                    }}
                    size="xs"
                  />
                </div>
                <div className="flex w-full items-center mt-[14px]">
                  <span className="text-[24px] leading-[28.8px] font-[500] font-inter">
                    <strong>
                      <Money
                        data={lineItem.cost.totalAmount}
                        withoutTrailingZeros
                      />
                    </strong>
                  </span>
                  <div className="flex gap-[16px] items-center ml-auto">
                    <CartQuantityAdjust line={lineItem} />
                    <ItemRemoveButton lineIds={[lineItem.id]} />
                  </div>
                </div>
              </div>
            </div>
            <hr className="h-[0.332px] border-dark6" />
          </>
        );
      })}
    </>
  );
}

export function CartActions({checkoutUrl}: any) {
  if (!checkoutUrl) return null;
  return (
    <div className="flex flex-col">
      <Link
        to={checkoutUrl}
        className="cart__checkout-button text-[16px] font-inter font-semibold leading-[17.6px] tracking-[-0.32px] text-black button w-full block text-center py-[16px] px-[24px] bg-yellow rounded-[360px] transition-all duration-200 hover:opacity-75"
      >
        Buy Now
      </Link>
    </div>
  );
}

export function CartSummary({cost}: any) {
  const updateCartFetcher = useCartFetchers(CartForm.ACTIONS.LinesUpdate);
  const [errorCart, setErrorCart] = useState('');

  useEffect(() => {
    if (updateCartFetcher.length && updateCartFetcher[0].data?.errors.length) {
      setErrorCart(updateCartFetcher[0].data?.errors[0]?.message);
    } else {
      if (updateCartFetcher.length) {
        setErrorCart('');
      }
    }
  }, [updateCartFetcher]);

  return (
    <>
      {errorCart ? (
        <div id="Cart-CartErrors" className="text-red2 mb-1 mt-3" role="alert">
          {errorCart}
        </div>
      ) : null}
      <div className="pb-[40.11px] divide-y divide-dark8">
        <div className="flex justify-between py-[24.13px]">
          <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
            Taxes
          </p>
          <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
            Calculated at checkout
          </p>
        </div>
        <div className="flex justify-between py-[24.13px]">
          <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
            Shipping
          </p>
          <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
            Calculated at checkout
          </p>
        </div>
        <div className="flex justify-between pt-[24.13px]">
          <p className="font-inter text-[16px] leading-[19.2px] text-dark4">
            Total
          </p>
          <Money
            data={{
              amount: cost?.subtotalAmount?.amount,
              currencyCode: 'USD',
            }}
            withoutTrailingZeros
            className={
              'font-inter text-[16px] leading-[19.2px] text-white font-bold'
            }
          />
        </div>
      </div>
    </>
  );
}

export function CartQuantityAdjust({line}: any) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className={'w-fit'}>
      <label htmlFor="Quantity" className="sr-only">
        Quantity
      </label>
      <div className="flex items-center border border-dark6 rounded-[8px] py-[7px] px-[8px]">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="quantity__button no-js-hidden flex justify-center items-center text-[#393D4E] w-[16px] h-[16px] transition hover:opacity-75 disabled:cursor-not-allowed"
            value={prevQuantity}
            disabled={quantity <= 1}
          >
            <span>&#8722;</span>
          </button>
        </UpdateCartButton>
        <input
          type="number"
          id="Quantity"
          defaultValue={quantity}
          value={quantity}
          className="quantity__input bg-transparent font-inter text-white !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none focus:border-none focus:box-shadow-none"
        />
        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="quantity__button no-js-hidden flex justify-center items-center text-[#393D4E] w-[16px] h-[16px] transition hover:opacity-75"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <span>&#43;</span>
          </button>
        </UpdateCartButton>
      </div>
    </div>
  );
}

export function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
    >
      {children}
    </CartForm>
  );
}

export function ItemRemoveButton({lineIds}: any) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds,
      }}
    >
      <button
        className="button button--tertiary bg-transparent hover:text-white hover:opacity-75 rounded-md font-small text-center my-2 max-w-xl leading-none w-10 h-10 flex items-center justify-center"
        type="submit"
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.3846 8.72C19.7976 8.754 20.1056 9.115 20.0726 9.528C20.0666 9.596 19.5246 16.307 19.2126 19.122C19.0186 20.869 17.8646 21.932 16.1226 21.964C14.7896 21.987 13.5036 22 12.2466 22C10.8916 22 9.5706 21.985 8.2636 21.958C6.5916 21.925 5.4346 20.841 5.2456 19.129C4.9306 16.289 4.3916 9.595 4.3866 9.528C4.3526 9.115 4.6606 8.753 5.0736 8.72C5.4806 8.709 5.8486 8.995 5.8816 9.407C5.88479 9.45041 6.10514 12.184 6.34526 14.8887L6.39349 15.4285C6.51443 16.7728 6.63703 18.0646 6.7366 18.964C6.8436 19.937 7.3686 20.439 8.2946 20.458C10.7946 20.511 13.3456 20.514 16.0956 20.464C17.0796 20.445 17.6116 19.953 17.7216 18.957C18.0316 16.163 18.5716 9.475 18.5776 9.407C18.6106 8.995 18.9756 8.707 19.3846 8.72ZM14.3454 2.00031C15.2634 2.00031 16.0704 2.61931 16.3074 3.5063L16.5614 4.7673C16.6435 5.18068 17.0062 5.48256 17.4263 5.48919L20.708 5.4893C21.122 5.4893 21.458 5.8253 21.458 6.2393C21.458 6.6533 21.122 6.9893 20.708 6.9893L17.4556 6.98915C17.4505 6.98925 17.4455 6.9893 17.4404 6.9893L17.416 6.9883L7.04162 6.98918C7.03355 6.98926 7.02548 6.9893 7.0174 6.9893L7.002 6.9883L3.75 6.9893C3.336 6.9893 3 6.6533 3 6.2393C3 5.8253 3.336 5.4893 3.75 5.4893L7.031 5.4883L7.13202 5.48191C7.50831 5.43309 7.82104 5.1473 7.8974 4.7673L8.1404 3.5513C8.3874 2.61931 9.1944 2.00031 10.1124 2.00031H14.3454ZM14.3454 3.5003H10.1124C9.8724 3.5003 9.6614 3.6613 9.6004 3.8923L9.3674 5.0623C9.33779 5.2105 9.29467 5.35332 9.23948 5.48957H15.2186C15.1634 5.35332 15.1201 5.2105 15.0904 5.0623L14.8474 3.8463C14.7964 3.6613 14.5854 3.5003 14.3454 3.5003Z"
            fill="#F85538"
          />
        </svg>
      </button>
    </CartForm>
  );
}

export function MultipleRemoveItem({
  removedItems,
  setRemovedItems,
}: {
  removedItems: any;
  setRemovedItems: any;
}) {
  const lineIds = [...removedItems];

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds,
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        if (fetcher.state === 'loading') {
          setRemovedItems([]);
          (document.querySelectorAll('input[type="checkbox"]') as any).forEach(
            (el: any) => {
              el.checked = false;
            },
          );
        }
        return (
          <>
            {removedItems.length ? (
              <Button
                text={`Remove Selected (${removedItems.length})`}
                className="!bg-[#D72C0D1F] text-red2 mt-[20px]"
                isArrow={false}
                type={'submit'}
              />
            ) : null}
          </>
        );
      }}
    </CartForm>
  );
}

/**
 * Temporary discount UI
 * @param discountCodes the current discount codes applied to the cart
 * @todo rework when a design is ready
 */
export function CartDiscounts({discountCodes}: any) {
  const codes = discountCodes?.map(({code}: any) => code).join(', ') || null;

  return (
    <>
      {/* Have existing discount, display it with a remove option */}
      <dl className={codes ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-medium">
          <dt>Discount(s)</dt>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <button>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.3846 8.72C19.7976 8.754 20.1056 9.115 20.0726 9.528C20.0666 9.596 19.5246 16.307 19.2126 19.122C19.0186 20.869 17.8646 21.932 16.1226 21.964C14.7896 21.987 13.5036 22 12.2466 22C10.8916 22 9.5706 21.985 8.2636 21.958C6.5916 21.925 5.4346 20.841 5.2456 19.129C4.9306 16.289 4.3916 9.595 4.3866 9.528C4.3526 9.115 4.6606 8.753 5.0736 8.72C5.4806 8.709 5.8486 8.995 5.8816 9.407C5.88479 9.45041 6.10514 12.184 6.34526 14.8887L6.39349 15.4285C6.51443 16.7728 6.63703 18.0646 6.7366 18.964C6.8436 19.937 7.3686 20.439 8.2946 20.458C10.7946 20.511 13.3456 20.514 16.0956 20.464C17.0796 20.445 17.6116 19.953 17.7216 18.957C18.0316 16.163 18.5716 9.475 18.5776 9.407C18.6106 8.995 18.9756 8.707 19.3846 8.72ZM14.3454 2.00031C15.2634 2.00031 16.0704 2.61931 16.3074 3.5063L16.5614 4.7673C16.6435 5.18068 17.0062 5.48256 17.4263 5.48919L20.708 5.4893C21.122 5.4893 21.458 5.8253 21.458 6.2393C21.458 6.6533 21.122 6.9893 20.708 6.9893L17.4556 6.98915C17.4505 6.98925 17.4455 6.9893 17.4404 6.9893L17.416 6.9883L7.04162 6.98918C7.03355 6.98926 7.02548 6.9893 7.0174 6.9893L7.002 6.9883L3.75 6.9893C3.336 6.9893 3 6.6533 3 6.2393C3 5.8253 3.336 5.4893 3.75 5.4893L7.031 5.4883L7.13202 5.48191C7.50831 5.43309 7.82104 5.1473 7.8974 4.7673L8.1404 3.5513C8.3874 2.61931 9.1944 2.00031 10.1124 2.00031H14.3454ZM14.3454 3.5003H10.1124C9.8724 3.5003 9.6614 3.6613 9.6004 3.8923L9.3674 5.0623C9.33779 5.2105 9.29467 5.35332 9.23948 5.48957H15.2186C15.1634 5.35332 15.1201 5.2105 15.0904 5.0623L14.8474 3.8463C14.7964 3.6613 14.5854 3.5003 14.3454 3.5003Z"
                    fill="#F85538"
                  />
                </svg>
              </button>
            </UpdateDiscountForm>
            <dd>{codes}</dd>
          </div>
        </div>
      </dl>

      {/* No discounts, show an input to apply a discount */}
      <UpdateDiscountForm>
        <div
          className={`${
            codes ? 'hidden' : 'flex'
          } items-center gap-4 justify-between text-copy`}
        >
          <input
            className={getInputStyleClasses()}
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          <button className="flex justify-end font-medium whitespace-nowrap">
            Apply Discount
          </button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

function UpdateDiscountForm({children}: any) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/cart" method="post">
      <input
        type="hidden"
        name="cartAction"
        value={CartAction.UPDATE_DISCOUNT}
      />
      {children}
    </fetcher.Form>
  );
}
