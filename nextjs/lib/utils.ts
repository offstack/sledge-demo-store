import { ReadonlyURLSearchParams } from "next/navigation";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export function statusMessage(status: string) {
  const translations: Record<string, string> = {
    ATTEMPTED_DELIVERY: "Attempted delivery",
    CANCELED: "Canceled",
    CONFIRMED: "Confirmed",
    DELIVERED: "Delivered",
    FAILURE: "Failure",
    FULFILLED: "Fulfilled",
    IN_PROGRESS: "In Progress",
    IN_TRANSIT: "In transit",
    LABEL_PRINTED: "Label printed",
    LABEL_PURCHASED: "Label purchased",
    LABEL_VOIDED: "Label voided",
    MARKED_AS_FULFILLED: "Marked as fulfilled",
    NOT_DELIVERED: "Not delivered",
    ON_HOLD: "On Hold",
    OPEN: "Open",
    OUT_FOR_DELIVERY: "Out for delivery",
    PARTIALLY_FULFILLED: "Partially Fulfilled",
    PENDING_FULFILLMENT: "Pending",
    PICKED_UP: "Displayed as Picked up",
    READY_FOR_PICKUP: "Ready for pickup",
    RESTOCKED: "Restocked",
    SCHEDULED: "Scheduled",
    SUBMITTED: "Submitted",
    UNFULFILLED: "Unfulfilled",
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}

export const INPUT_STYLE_CLASSES =
  "block bg-dark2 border-none pl-[24px] text-[14px] md:text-[16px] focus:ring-inset focus:border focus:border-solid focus:border-green appearance-none rounded-[12px] focus:ring-0 w-full py-[22px] text-dark4 placeholder:text-dark4 leading-tight focus:shadow-outline";

export const getInputStyleClasses = (isError?: string | null) => {
  return `${INPUT_STYLE_CLASSES} ${
    isError ? "border-red-500" : "border-primary/20"
  }`;
};

export function assertApiErrors(data: Record<string, any> | null | undefined) {
  const errorMessage = data?.customerUserErrors?.[0]?.message;
  if (errorMessage) {
    throw new Error(errorMessage);
  }
}
