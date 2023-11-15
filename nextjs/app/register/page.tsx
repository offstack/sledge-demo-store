import RegisterForm from "components/account/registerForm";
import { CardImage } from "components/global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Page() {
  return (
    <div className="max-w-[1170px] mx-auto px-5 lg:px-20 xl:px-0 pt-[1.9rem]">
      <div className="flex gap-[50px] flex-col lg:flex-row">
        <CardImage
          image={
            "/images/creative-fashion-design-men-casual-clothing-set-accessories_1.png"
          }
          title=""
          descripton=""
        />
        <div className="flex flex-col flex-auto lg:mt-[20px]">
          <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
            Create an Account
          </h1>
          <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
            By creating an account, you gain access to a range of benefits and
            exclusive features. Join our community today and enjoy the
            convenience of a customized shopping journey.
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
