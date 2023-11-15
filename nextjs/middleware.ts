import { getSledgeSession } from "@sledge-app/api";
import { getCustomer } from "lib/shopify";
import parseGid from "lib/shopify/parse-gid";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const getSession: any = request.cookies.get("session")?.value;
  let customer: any = {};

  if (getSession) {
    customer = await getCustomer(getSession);
    customer = customer.data.customer;
    customer = {
      userId: parseGid(customer?.id).id,
      fullName: `${customer?.firstName} ${customer?.lastName}`,
      email: customer?.email,
    };
  }

  let sledgeLastSession: any =
    request.cookies.get("sledgeSession")?.value || "{}";
  sledgeLastSession = JSON.parse(sledgeLastSession);

  const sledgeApiKey = process.env.SLEDGE_API_KEY || "";
  const sledgeISKey = process.env.SLEDGE_IS_KEY || "";

  const sledgeSession: any = await getSledgeSession({
    lastSession: sledgeLastSession,
    apiKey: sledgeApiKey,
    instantSearchApiKey: sledgeISKey,
    userId: customer?.userId || "",
    userEmail: customer?.email || "",
    userFullname: customer?.fullName || "",
  });

  let response = NextResponse.next();

  // if no session save, redirect to save session
  if (!sledgeLastSession?.token) {
    // response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("sledgeSession", JSON.stringify(sledgeSession));
  }

  const customerCookie = request.cookies.get("session");

  if (!customerCookie && request.nextUrl.pathname.startsWith("/account")) {
    response = NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    customerCookie &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/recover"))
  ) {
    response = NextResponse.redirect(new URL("/account", request.url));
  }

  return response;
}
