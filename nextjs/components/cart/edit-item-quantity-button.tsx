import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { removeItem, updateItemQuantity } from "components/cart/actions";
import LoadingDots from "components/loading-dots";
import type { CartItem } from "lib/shopify/types";

export default function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      onClick={() => {
        startTransition(async () => {
          const error =
            type === "minus" && item.quantity - 1 === 0
              ? await removeItem(item.id)
              : await updateItemQuantity({
                  lineId: item.id,
                  variantId: item.merchandise.id,
                  quantity:
                    type === "plus" ? item.quantity + 1 : item.quantity - 1,
                });

          if (error) {
            // Trigger the error boundary in the root error.js
            throw new Error(error.toString());
          }

          router.refresh();
        });
      }}
      disabled={isPending}
      className={`quantity__button no-js-hidden flex justify-center items-center text-[#393D4E] w-[16px] h-[16px] transition hover:opacity-75 disabled:cursor-not-allowed ${
        isPending ? "cursor-not-allowed" : ""
      }`}
    >
      {isPending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === "plus" ? (
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
      ) : (
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
      )}
    </button>
  );
}
