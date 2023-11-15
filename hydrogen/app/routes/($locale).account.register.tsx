import {
  redirect,
  json,
  type ActionFunction,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useFetcher,
  type V2_MetaFunction,
} from '@remix-run/react';

import {Button, CardImage, Input, Link} from '~/components';
import {useState} from 'react';

import {getInputStyleClasses} from '~/lib/utils';

import image from '~/components/Pages/assets/creative-fashion-design-men-casual-clothing-set-accessories_1.png';

import {doLogin} from './($locale).account.login';

export async function loader({context, params}: LoaderArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }

  return new Response(null);
}

type ActionData = {
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, {status: 400});

export const action: ActionFunction = async ({request, context, params}) => {
  const {session, storefront} = context;
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string'
  ) {
    return badRequest({
      formError:
        'Please provide both an email, a password, a First Name or a Last Name',
    });
  }

  try {
    const data = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {firstName, lastName, email, password},
      },
    });

    if (!data?.customerCreate?.customer?.id) {
      /**
       * Something is wrong with the user's input.
       */
      throw new Error(data?.customerCreate?.customerUserErrors.join(', '));
    }

    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    return redirect(params.locale ? `${params.locale}/account` : '/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: any) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Something went wrong. Please try again later.',
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError:
        'Sorry. We could not create an account with this email. User might already exist, try to login instead.',
    });
  }
};

export const meta: V2_MetaFunction = () => {
  return [{title: 'Register'}];
};

export default function Register() {
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null,
  );
  const [nativeFirstNameError, setNativeFirstNameError] = useState<
    null | string
  >(null);
  const [nativeLastNameError, setNativeLastNameError] = useState<null | string>(
    null,
  );

  const fetcher = useFetcher();

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
      <div className="flex gap-[50px] flex-col lg:flex-row">
        <CardImage
          image={
            '/assets/images/creative-fashion-design-men-casual-clothing-set-accessories.webp'
          }
          title=""
          descripton=""
        />

        <div className="flex flex-col flex-auto lg:mt-[20px]">
          <div className="">
            <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
              Create an Account
            </h1>
            <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
              By creating an account, you gain access to a range of benefits and
              exclusive features. Join our community today and enjoy the
              convenience of a customized shopping journey.
            </p>
          </div>
          {/* TODO: Add onSubmit to validate _before_ submission with native? */}
          {/* TODO: match form inputs with figma and its function */}
          <fetcher.Form
            method="post"
            noValidate
            className="mt-[20px] md:mt-[40px] gap-[40px] flex flex-col"
          >
            {fetcher.data?.formError && (
              <div className="flex items-center justify-center mb-6 bg-dark2 rounded-md">
                <p className="m-4 text-s text-red">{fetcher.data.formError}</p>
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
                  colSpan={'sm:col-span-3'}
                  onBlur={(event: any) => {
                    setNativeFirstNameError(
                      event.currentTarget.value.length &&
                        !event.currentTarget.validity.valid
                        ? 'Invalid First Name'
                        : null,
                    );
                  }}
                />
                {nativeFirstNameError && (
                  <p className="text-red-500 text-xs">
                    {nativeFirstNameError}{' '}
                  </p>
                )}
                <Input
                  label="Last Name"
                  type="text"
                  className={`${getInputStyleClasses(nativeLastNameError)}`}
                  name="lastName"
                  placeholder="Last Name"
                  colSpan={'sm:col-span-3'}
                  onBlur={(event: any) => {
                    setNativeLastNameError(
                      event.currentTarget.value.length &&
                        !event.currentTarget.validity.valid
                        ? 'Invalid Last Name'
                        : null,
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
                  colSpan={'col-span-full'}
                  onBlur={(event: any) => {
                    setNativeEmailError(
                      event.currentTarget.value.length &&
                        !event.currentTarget.validity.valid
                        ? 'Invalid email address'
                        : null,
                    );
                  }}
                />
                {nativeEmailError && (
                  <p className="text-red-500 text-xs">{nativeEmailError} </p>
                )}
                <Input
                  label="Password"
                  type="password"
                  className={`${getInputStyleClasses(nativePasswordError)}`}
                  name="password"
                  placeholder="Password"
                  colSpan={'col-span-full'}
                  onBlur={(event: any) => {
                    if (
                      event.currentTarget.validity.valid ||
                      !event.currentTarget.value.length
                    ) {
                      setNativePasswordError(null);
                    } else {
                      setNativePasswordError(
                        event.currentTarget.validity.valueMissing
                          ? 'Please enter a password'
                          : 'Passwords must be at least 8 characters',
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
                  to="/account/login"
                  className="text-yellow underline button-hover-state ml-[4px]"
                >
                  Login
                </Link>
              </p>
              <Button
                text="Create Account"
                type={'submit'}
                disabledProps={!!(nativePasswordError || nativeEmailError)}
                loading={fetcher.state}
              />
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_CREATE_MUTATION = `#graphql
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
