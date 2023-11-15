import {
  json,
  redirect,
  type ActionFunction,
  type AppLoadContext,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  type V2_MetaFunction,
} from '@remix-run/react';
import {Button, CardImage, Input, Link} from '~/components';
import {useState} from 'react';

import {getInputStyleClasses} from '~/lib/utils';

export const handle = {
  isPublic: true,
};

export async function loader({context, params}: LoaderArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }

  // TODO: Query for this?
  return json({shopName: 'Hydrogen'});
}

type ActionData = {
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, {status: 400});

export const action: ActionFunction = async ({request, context, params}) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Please provide both an email and a password.',
    });
  }

  const {session, storefront} = context;

  try {
    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    return redirect(params.locale ? `/${params.locale}/account` : '/account', {
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
        'Sorry. We did not recognize either your email or password. Please try to sign in again or create a new account.',
    });
  }
};

export const meta: V2_MetaFunction = () => {
  return [{title: 'Login'}];
};

export default function Login() {
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null,
  );

  const fetcher = useFetcher();

  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
      <div className="flex gap-[50px] flex-col lg:flex-row">
        <CardImage
          image={
            '/assets/images/green-classic-jacket-beige-women-s-top-with-handbag-women-s-stylish-autumn-spring-trendy-clothes-fashion-concept-flat-lay-top-view_1.png'
          }
          title=""
          descripton=""
        />
        {/* TODO: Add onSubmit to validate _before_ submission with native? */}
        <div className="flex flex-col flex-auto lg:mt-[20px]">
          <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
            Account login
          </h1>
          <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
            Please enter your registered email and password to log in and access
            your account. Once logged in, you can view your order history,
            update your profile information, and manage your preferences.
          </p>
          <fetcher.Form
            method="post"
            noValidate
            className="mt-[20px] md:mt-[40px] gap-[25px] md:gap-[40px] flex flex-col max-w-[550px]"
          >
            {fetcher.data?.formError && (
              <div className="flex items-center justify-center mb-6 bg-dark2 rounded-md">
                <p className="m-4 text-s text-red">{fetcher.data.formError}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-[20px] md:gap-[28px] sm:grid-cols-6 md:col-span-2 mb-[20px] md:mb-[8px]">
              <Input
                label="Email"
                type="email"
                className={`${getInputStyleClasses(nativeEmailError)}`}
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
                className={`${getInputStyleClasses(nativePasswordError)}`}
                type="password"
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
              <Link
                to="/account/recover"
                className="font-inter font-medium text-[14px] leading-[22px] tracking-[-0.02em] w-max text-dark4"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-[20px] md:gap-[24px]">
              <p className="w-fit font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
                Dont have an account?
                <Link
                  to="/account/register"
                  className="text-yellow underline button-hover-state ml-[4px]"
                >
                  Sign Up
                </Link>
              </p>
              <Button
                text="Login"
                type={'submit'}
                loading={fetcher.state}
                disabledProps={!!(nativePasswordError || nativeEmailError)}
              />
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

const LOGIN_MUTATION = `#graphql
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerUserErrors {
          code
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }
  `;

export async function doLogin(
  {storefront}: AppLoadContext,
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
) {
  const data = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken;
  }

  /**
   * Something is wrong with the user's input.
   */
  throw new Error(
    data?.customerAccessTokenCreate?.customerUserErrors.join(', '),
  );
}
