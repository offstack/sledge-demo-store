"use client";

import { recoveringAddress } from "components/account/action";
import { Button, Link } from "components/global";
import { getInputStyleClasses } from "lib/utils";
import { FormEvent, useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //handling default state
    setError("");
    setIsLoading(true);
    setIsSubmitted(false);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");

    try {
      const result = await recoveringAddress({
        email,
      });

      const formError = "Something went wrong. Please try again later.";
      if (result.customerRecover.customerUserErrors.length) setError(formError);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        {isSubmitted ? (
          <>
            <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
              Request Sent.
            </h1>
            <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
              Forgot Password.
            </h1>
            <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
              Enter the email address associated with your account to receive a
              link to reset your password.
            </p>
            <form
              method="post"
              noValidate
              className="pt-6 pb-8 mt-4 mb-4 space-y-3"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="flex items-center justify-center mb-6">
                  <p className="m-4 text-contrast text-red">{error}</p>
                </div>
              )}
              <div>
                <input
                  className={`mb-1 ${getInputStyleClasses(nativeEmailError)}`}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onBlur={(event) => {
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
              </div>
              <div className="flex items-center justify-between pt-3">
                <Button
                  text="Request Reset Link"
                  loading={isLoading}
                  type={"submit"}
                />
              </div>
              <div className="flex items-center">
                <p className="mt-6 w-fit font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
                  Return to &nbsp;
                  <Link
                    className="text-yellow underline button-hover-state"
                    href="/login"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
