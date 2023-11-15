import {Suspense, useEffect, useRef, useState} from 'react';
import {useOutsideClick} from '~/lib/useOutsideClick';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {Await, FetcherWithComponents, useMatches} from '@remix-run/react';
import {Button, Link, LoadingDots} from '..';
import {CartForm, Money} from '@shopify/hydrogen';
import {
  CartLine,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';

interface ICartDrawerProps {
  isOpen: boolean;
  setCartDrawerState: any;
}

export function CartDrawer({isOpen, setCartDrawerState}: ICartDrawerProps) {
  const [root] = useMatches();
  const ref: any = useRef();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const updateCartFetcher = useCartFetchers(CartForm.ACTIONS.LinesUpdate);

  const [errorCart, setErrorCart] = useState('');

  const [previousTotalQuantity, setPreviousTotalQuantity] = useState(0);
  const [currentTotalQuantity, setCurrentTotalQuantity] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    if (addToCartFetchers.length && addToCartFetchers[0].data?.errors.length) {
      setErrorCart(addToCartFetchers[0].data?.errors[0]?.message);
    } else {
      if (addToCartFetchers.length) {
        setErrorCart('');
      }
    }

    if (updateCartFetcher.length && updateCartFetcher[0].data?.errors.length) {
      setErrorCart(updateCartFetcher[0].data?.errors[0]?.message);
    } else {
      if (updateCartFetcher.length) {
        setErrorCart('');
      }
    }

    if (isOpen || !addToCartFetchers.length) return;
  }, [addToCartFetchers, updateCartFetcher, isOpen]);

  //manipulate fetcher state
  useEffect(() => {
    const lastFetcher = addToCartFetchers[addToCartFetchers.length - 1];
    const fetcherState = !addToCartFetchers.length
      ? 'idle'
      : lastFetcher?.state;

    if (root.data?.cart) {
      root.data?.cart.then((item: any) => {
        setPreviousTotalQuantity(item.totalQuantity);
      });
    }

    if (lastFetcher) {
      setCurrentTotalQuantity(lastFetcher.data?.cart.totalQuantity);
    }

    if (fetcherState !== 'submitting') {
      setIsAddedToCart(true);
    }

    if (previousTotalQuantity === currentTotalQuantity) {
      setIsAddedToCart(false);
    }

    if (isAddedToCart && previousTotalQuantity === currentTotalQuantity) {
      setCartDrawerState(true);
    }
  }, [previousTotalQuantity, addToCartFetchers]);

  useOutsideClick(ref, () => {
    if (isOpen) setCartDrawerState(false);
  });

  return (
    <div
      className={`${
        isOpen ? 'visible' : 'invisible'
      } absolute z-50 cart-drawer`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-dark2 bg-opacity-50 transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={ref}
            className={`pointer-events-none fixed inset-y-0 flex max-w-full transform duration-300 ${
              isOpen ? 'right-0' : 'right-[-999px]'
            }`}
          >
            <div className="pointer-events-auto w-screen md:max-w-[387px]">
              <Suspense fallback={<div>Loading</div>}>
                <Await resolve={root.data?.cart}>
                  {(cart) => (
                    <div className="flex h-full flex-col overflow-hidden bg-dark5">
                      {/* cart drawer line */}
                      <div className="flex-1 px-[20px] py-8 pb-[12px]">
                        <div className="flex items-start justify-between px-3">
                          <h4
                            className="text-white text-lg font-bold lg:text-[24px] leading-[28.8px]"
                            id="slide-over-title"
                          >
                            My Cart
                          </h4>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="drawer__close -m-2 bg-dark p-1 rounded-xl"
                              onClick={() => {
                                setCartDrawerState(false);
                              }}
                            >
                              <span className="sr-only">Close panel</span>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.13398 19.3248L6.08398 18.2748L11.859 12.4998L6.08398 6.7248L7.13398 5.6748L12.909 11.4498L18.684 5.6748L19.734 6.7248L13.959 12.4998L19.734 18.2748L18.684 19.3248L12.909 13.5498L7.13398 19.3248Z"
                                  fill="#9C9C9C"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flow-root pt-[28px]">
                          <ul
                            role="list"
                            className={`divide-y divide-dark8 drawer__cart-items-wrapper overflow-y-scroll px-3 ${
                              !cart?.lines.edges.length
                                ? 'max-h-full'
                                : 'max-h-[350px]'
                            }`}
                          >
                            {!cart?.lines.edges.length ? (
                              <CartEmpty
                                setCartDrawerState={setCartDrawerState}
                              />
                            ) : (
                              cart?.lines.edges.map(
                                (lineItem: any, index: any) => {
                                  const {node} = lineItem;
                                  node.cost.totalAmount.currencyCode = 'USD';
                                  return (
                                    <li
                                      key={index}
                                      className="flex py-[24.86px] cart-item"
                                    >
                                      <div className="relative">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[8px] bg-dark2">
                                          <img
                                            src={node.merchandise.image.url}
                                            alt="Product Image"
                                            width={node.merchandise.image.width}
                                            height={
                                              node.merchandise.image.height
                                            }
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </div>
                                        <div className="flex absolute top-[-13px] left-[-12.5px]">
                                          <ItemRemoveButton
                                            lineIds={[node.id]}
                                          />
                                        </div>
                                      </div>
                                      <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                          <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h5 className="text-[16px] leading-[19.2px] font-bold">
                                              <Link
                                                to={
                                                  '/products/' +
                                                  node.merchandise.product
                                                    .handle
                                                }
                                                onClick={() =>
                                                  setCartDrawerState(false)
                                                }
                                                className={
                                                  'text-white product-title'
                                                }
                                              >
                                                {node.merchandise.product.title}
                                              </Link>
                                            </h5>
                                            <Money
                                              data={node.cost.totalAmount}
                                              withoutTrailingZeros
                                              className="ml-4 text-white font-inter text-[16px] font-bold leading-[19.2px]"
                                            />
                                          </div>
                                          <div className="flex justify-between items-center pt-[8.4px]">
                                            {!node.merchandise.selectedOptions
                                              .length ? null : (
                                              <p className="flex gap-[10px] font-inter font-medium text-dark4 text-[10.8px] leading-[17.27px] tracking-[-0.216px] pl-[9px]">
                                                {node.merchandise.selectedOptions.map(
                                                  (
                                                    option: any,
                                                    index: number,
                                                  ) => {
                                                    return (
                                                      <span
                                                        key={index}
                                                        className="flex gap-[3px]"
                                                      >
                                                        <span>
                                                          {option.name + ':'}
                                                        </span>
                                                        <span>
                                                          {option.value}
                                                        </span>
                                                      </span>
                                                    );
                                                  },
                                                )}
                                              </p>
                                            )}
                                            <CartQuantityAdjust line={node} />
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  );
                                },
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                      {/* cart error */}
                      {errorCart ? (
                        <span className="text-red2 px-8">{errorCart}</span>
                      ) : null}
                      {/* cart drawer footer */}
                      {!cart?.lines.edges.length ? null : (
                        <div className="px-8">
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
                                  currencyCode: 'USD',
                                  amount: cart?.cost?.subtotalAmount.amount,
                                }}
                                className="font-inter text-[16px] leading-[19.2px] text-white font-bold"
                                withoutTrailingZeros
                              />
                            </div>
                          </div>

                          <div>
                            <Link
                              to={'/cart'}
                              className="block font-inter bg-dark9 text-[16px] font-semibold leading-[17.6px] tracking-[-0.32px] text-center text-white mb-[12px] py-[16px] px-[24px] rounded-[360px] transition-all duration-200 hover:opacity-75"
                              onClick={() => setCartDrawerState(false)}
                            >
                              <span>
                                View My Cart{' '}
                                {!cart?.lines?.edges.length
                                  ? null
                                  : '(' + cart?.lines?.edges.length + ')'}
                              </span>
                            </Link>
                            <a
                              href={cart?.checkoutUrl}
                              className="cart__checkout-button text-[16px] font-inter font-semibold leading-[17.6px] tracking-[-0.32px] text-black button w-full block text-center py-[16px] px-[24px] bg-yellow rounded-[360px] transition-all duration-200 hover:opacity-75"
                            >
                              <span>Checkout</span>
                            </a>
                          </div>
                          <div className="mt-[16px] flex justify-center text-center ">
                            <p>
                              <button
                                type="button"
                                onClick={() => setCartDrawerState(false)}
                                className="font-sledge-font-family-2 text-black font-[400] text-[14px] leading-[15.4px] tracking-[-2%]"
                              >
                                Continue Shopping
                              </button>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartQuantityAdjust({line}: any) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center rounded-[8px] py-[2px] px-[2.5px] border border-dark6">
      <label htmlFor="Quantity" className="sr-only">
        Quantity
      </label>
      <div className="flex justify-between text-sm items-center w-fit">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="flex justify-center items-center text-sledge-color-grey-5 w-[16px] h-[16px] transition hover:opacity-75 disabled:cursor-not-allowed"
            value={prevQuantity}
            disabled={quantity <= 1}
          >
            <svg
              className="pointer-events-none"
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.1419 8H3.80859"
                stroke="#393D4E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </UpdateCartButton>

        <input
          type="number"
          readOnly
          className="bg-transparent font-inter !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none focus:border-none focus:box-shadow-none pointer-events-none"
          value={quantity}
        />

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="flex justify-center items-center text-sledge-color-grey-5 w-[16px] h-[16px] transition hover:opacity-75"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <svg
              className="pointer-events-none"
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.80859 7.99967H13.1419M8.47526 3.33301V12.6663"
                stroke="#393D4E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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

export function ItemRemoveButton({lineIds}: {lineIds: CartLine['id'][]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds,
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <button
            className={`button button--tertiary p-[5px] rounded-[360px] border-[0.5px] border-solid border-dark2 bg-dark7 ${
              fetcher.state === 'idle' ? '' : 'cursor-not-allowed'
            }`}
            type="submit"
          >
            {fetcher.state === 'idle' ? (
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.25 3.48844C10.3075 3.29594 8.35333 3.19678 6.405 3.19678C5.25 3.19678 4.095 3.25511 2.94 3.37178L1.75 3.48844"
                  stroke="#6A6A6A"
                  strokeWidth="0.89611"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.95801 2.899L5.08634 2.13484C5.17967 1.58067 5.24967 1.1665 6.23551 1.1665H7.76384C8.74967 1.1665 8.82551 1.604 8.91301 2.14067L9.04134 2.899"
                  stroke="#6A6A6A"
                  strokeWidth="0.89611"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.9946 5.33154L10.6154 11.2057C10.5513 12.1215 10.4988 12.8332 8.87126 12.8332H5.12626C3.49876 12.8332 3.44626 12.1215 3.3821 11.2057L3.00293 5.33154"
                  stroke="#6A6A6A"
                  strokeWidth="0.89611"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.02734 9.625H7.96984"
                  stroke="#6A6A6A"
                  strokeWidth="0.89611"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.54395 7.2915H8.46061"
                  stroke="#6A6A6A"
                  strokeWidth="0.89611"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <LoadingDots className="bg-white" />
            )}
          </button>
        );
      }}
    </CartForm>
  );
}

export function CartEmpty({setCartDrawerState}: any) {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <div className="flex items-center text-white justify-center gap-x-6 lg:justify-start hover:opacity-70 transition duration-200 mt-[8px] lg:mt-[12px] mb-4">
        <Button
          isArrow
          text="Continue shopping"
          to="/collections/all"
          onClick={() => setCartDrawerState(false)}
        />
      </div>
    </div>
  );
}
