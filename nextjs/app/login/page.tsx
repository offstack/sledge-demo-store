import LoginForm from "components/account/loginForm";
import { CardImage } from "components/global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
      <div className="flex gap-[50px] flex-col lg:flex-row">
        <CardImage
          image={
            "/images/green-classic-jacket-beige-women-s-top-with-handbag-women-s-stylish-autumn-spring-trendy-clothes-fashion-concept-flat-lay-top-view_1.png"
          }
          title=""
          descripton=""
        />
        <div className="flex flex-col flex-auto lg:mt-[20px]">
          <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
            Account login
          </h1>
          <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
            Please enter your registered email and password to log in and access
            your account. Once logged in, you can view your order history,
            update your profile information, and manage your preferences.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
