"use client";

import { Button, Input, Link } from "components/global";
import { getInputStyleClasses } from "lib/utils";
import { FormEvent, useState } from "react";
import { register } from "./action";

export default function RegisterForm() {
  const [error, setError] = useState<string>("");
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null
  );
  const [nativeFirstNameError, setNativeFirstNameError] = useState<
    null | string
  >(null);
  const [nativeLastNameError, setNativeLastNameError] = useState<null | string>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function registerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //handling default state
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    try {
      const registerResut = await register({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      const formError = `Sorry. We could not create an account with this email. User might already exist, try to login instead.`;
      if (registerResut.customerCreate.customerUserErrors?.length)
        setError(formError);

      if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string"
      )
        setError(
          "Please provide both an email, a password, a First Name or a Last Name"
        );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      method="post"
      noValidate
      className="mt-[20px] md:mt-[40px] gap-[40px] flex flex-col"
      onSubmit={registerSubmit}
    >
      {error && (
        <div className="flex items-center justify-center mb-6 bg-dark2 rounded-md">
          <p className="m-4 text-s text-red">{error}</p>
        </div>
      )}
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-[20px] md:gap-[28px] sm:grid-cols-6 md:col-span-2">
          <Input
            label="First Name"
            type="text"
            className={`${getInputStyleClasses(nativeFirstNameError)}`}
            name="firstName"
            placeholder="First Name"
            colSpan={"sm:col-span-3"}
            onBlur={(event: any) => {
              setNativeFirstNameError(
                event.currentTarget.value.length &&
                  !event.currentTarget.validity.valid
                  ? "Invalid First Name"
                  : null
              );
            }}
          />
          {nativeFirstNameError && (
            <p className="text-red-500 text-xs">{nativeFirstNameError} </p>
          )}
          <Input
            label="Last Name"
            type="text"
            className={`${getInputStyleClasses(nativeLastNameError)}`}
            name="lastName"
            placeholder="Last Name"
            colSpan={"sm:col-span-3"}
            onBlur={(event: any) => {
              setNativeLastNameError(
                event.currentTarget.value.length &&
                  !event.currentTarget.validity.valid
                  ? "Invalid Last Name"
                  : null
              );
            }}
          />
          {nativeLastNameError && (
            <p className="text-red-500 text-xs">{nativeLastNameError} </p>
          )}
          <Input
            label="Email"
            type="email"
            className={`${getInputStyleClasses(nativePasswordError)}`}
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
              {nativeEmailError}{" "}
            </span>
          )}
          <Input
            label="Password"
            type="password"
            className={`${getInputStyleClasses(nativePasswordError)}`}
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
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[20px] md:gap-[24px]">
        <p className="w-fit font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
          Already have an account?
          <Link
            href="/login"
            className="text-yellow underline button-hover-state ml-[4px]"
          >
            Login
          </Link>
        </p>
        <Button
          text="Create Account"
          type={"submit"}
          disabledProps={!!(nativePasswordError || nativeEmailError)}
          loading={isLoading}
        />
      </div>
    </form>
  );
}
