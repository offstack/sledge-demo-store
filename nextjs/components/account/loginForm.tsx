"use client";

import { Button, Input, Link } from "components/global";
import { getInputStyleClasses } from "lib/utils";
import { FormEvent, useState } from "react";
import { login } from "./action";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //handling default state
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const loginResut = await login({
        email,
        password,
      });

      const formError = `Sorry. We did not recognize either your email or password. Please try to sign in again or create a new account.`;
      if (loginResut?.customerAccessTokenCreate.customerUserErrors.length)
        setError(formError);

      if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string"
      )
        setError("Please provide both an email and a password.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form
        method="post"
        noValidate
        className="mt-[20px] md:mt-[40px] gap-[25px] md:gap-[40px] flex flex-col max-w-[550px]"
        onSubmit={loginSubmit}
      >
        {error && (
          <div className="flex items-center justify-center mb-6 bg-dark2 rounded-md">
            <p className="m-4 text-s text-red">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-[20px] md:gap-[28px] sm:grid-cols-6 md:col-span-2 mb-[20px] md:mb-[8px]">
          <Input
            label="Email"
            type="email"
            className={`${getInputStyleClasses(nativeEmailError)}`}
            name="email"
            placeholder='Email "example@gmail.com"'
            colSpan={"col-span-full"}
            onBlur={(event: any) => {
              setNativeEmailError(
                event.currentTarget.value.length &&
                  !event.currentTarget.validity.valid
                  ? "Invalid email address"
                  : null
              );
            }}
          />
          {nativeEmailError && (
            <span className="text-red text-xs col-span-full">
              {nativeEmailError}
            </span>
          )}
          <Input
            label="Password"
            className={`${getInputStyleClasses(nativePasswordError)}`}
            type="password"
            name="password"
            placeholder="Password"
            colSpan={"col-span-full"}
            onBlur={(event: any) => {
              if (
                event.currentTarget.validity.valid ||
                !event.currentTarget.value.length
              ) {
                setNativePasswordError(null);
              } else {
                setNativePasswordError(
                  event.currentTarget.validity.valueMissing
                    ? "Please enter a password"
                    : "Passwords must be at least 8 characters"
                );
              }
            }}
          />
          {nativePasswordError && (
            <p className="text-red-500 text-xs"> {nativePasswordError}</p>
          )}
          <Link
            href="/recover"
            className="font-inter font-medium text-[14px] leading-[22px] tracking-[-0.02em] w-max text-dark4"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-[20px] md:gap-[24px]">
          <p className="w-fit font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
            Dont have an account?
            <Link
              href="/register"
              className="text-yellow underline button-hover-state ml-[4px]"
            >
              Sign Up
            </Link>
          </p>
          <Button text="Login" loading={isLoading} type={"submit"} />
        </div>
      </form>
    </>
  );
}
