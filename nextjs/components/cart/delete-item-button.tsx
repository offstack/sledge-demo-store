import LoadingDots from "components/loading-dots";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import { removeItem } from "components/cart/actions";
import { Button } from "components/global";
import type { CartItem } from "lib/shopify/types";
import { useTransition } from "react";

export default function DeleteItemButton({
  item,
  type = "modal",
  removedItems,
  setRemovedItems,
}: {
  item: CartItem;
  type?: "modal" | "cartPage" | "multipleRemove";
  removedItems?: any;
  setRemovedItems?: any;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {type === "modal" && (
        <button
          aria-label="Remove cart item"
          onClick={() => {
            startTransition(async () => {
              const error = await removeItem(item.id);

              if (error) {
                // Trigger the error boundary in the root error.js
                throw new Error(error.toString());
              }

              router.refresh();
            });
          }}
          disabled={isPending}
          className={clsx(
            "button button--tertiary p-[5px] rounded-[360px] border-[0.5px] border-solid border-dark2 bg-dark7",
            {
              "cursor-not-allowed": isPending,
            }
          )}
        >
          {isPending ? (
            <LoadingDots className="bg-white" />
          ) : (
            <svg
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
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
          )}
        </button>
      )}
      {type === "cartPage" && (
        <button
          aria-label="Remove cart item"
          className="button button--tertiary bg-transparent hover:text-white hover:opacity-75 rounded-md font-small text-center my-2 max-w-xl leading-none w-10 h-10 flex items-center justify-center"
          type="button"
          onClick={() => {
            startTransition(async () => {
              const error = await removeItem(item.id);

              if (error) {
                // Trigger the error boundary in the root error.js
                throw new Error(error.toString());
              }

              router.refresh();
            });
          }}
          disabled={isPending}
        >
          {isPending ? (
            <LoadingDots className="bg-white" />
          ) : (
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
          )}
        </button>
      )}
      {type === "multipleRemove" && (
        <div>
          <div>
            {removedItems.length ? (
              <Button
                text={`Remove Selected (${removedItems.length})`}
                className="!bg-[#D72C0D1F] text-red2 mt-[20px]"
                isArrow={false}
                type={"submit"}
                onClick={() => {
                  startTransition(async () => {
                    removedItems?.map(async (item: string) => {
                      const error = await removeItem(item);

                      if (error) {
                        // Trigger the error boundary in the root error.js
                        throw new Error(error.toString());
                      }
                      setRemovedItems([]);
                      (
                        document.querySelectorAll(
                          'input[type="checkbox"]'
                        ) as any
                      ).forEach((el: any) => {
                        el.checked = false;
                      });

                      router.refresh();
                    });
                  });
                }}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
